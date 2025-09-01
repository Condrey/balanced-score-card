import { perspectives } from "@/lib/contants";
import { BSCData } from "@/lib/types";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { PerspectiveType } from "@prisma/client";
import * as carbone from "carbone";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import z from "zod";

export async function POST(req: Request, res: Response) {
  try {
    console.info("Generating BSC document...");
    const body = await req.json();
    const bsc = body as BSCData;

    const templatePath = path.resolve(
      process.cwd(),
      "public/templates/bsc_template.docx",
    );
    console.log({ bsc: bsc.supervisee });
    const clients = !!bsc.clients.length
      ? bsc.clients
      : await getClients(bsc.supervisee.jobTitle);
    const perspectiveGroups = groupByPerspective(bsc);

    // Carbone expects data as an object
    const data = {
      ...bsc,
      perspectiveGroups,
      ndpProgrammes: bsc.ndpProgrammes.map((n) => ({ programme: n })),
      strategicObjectives: bsc.strategicObjectives.map((s) => ({
        objective: s,
      })),
      clients: clients.map((c) => ({ client: c })),
      behavioralAttributes: bsc.behavioralAttributes.map((bA, index) => ({
        ...bA,
        index: index + 1,
      })),
    };

    // Render DOCX using Carbone
    carbone.render(templatePath, data, {}, (err, result) => {
      if (err) {
        return Response.json(
          { message: "BSC generation failed", error: err },
          { status: 200, statusText: `Internal Server Error, ${err}` },
        );
      }

      // Save output file
      const downloadsPath = path.join(os.homedir(), "Downloads");
      if (!fs.existsSync(downloadsPath))
        fs.mkdirSync(downloadsPath, { recursive: true });

      const fileName = sanitizeFilename(
        `bsc ${bsc.supervisee.name} ${bsc.year}.docx`,
      );
      // Decide path depending on environment
      let outputPath;

      if (process.env.VERCEL) {
        // Running on Vercel → use /tmp
        outputPath = path.join("/tmp", fileName);
      } else {
        // Running locally → save to Downloads
        const downloadsPath = path.join(os.homedir(), "Downloads");
        if (!fs.existsSync(downloadsPath)) {
          fs.mkdirSync(downloadsPath, { recursive: true });
        }
        outputPath = path.join(downloadsPath, fileName);
      }

      try {
        fs.writeFileSync(outputPath, Buffer.from(result));
        console.log(`✅ BSC saved at: ${outputPath}`);
      } catch (error) {
        console.error("Error saving BSC document:", error);
        return Response.json(
          { message: "BSC generation failed", error },
          { status: 200, statusText: `${error}` },
        );
      }
    });
    const msg = `BSC generated successfully for ${bsc.supervisee.name}`;
    return Response.json("success", { status: 200, statusText: msg });
  } catch (error) {
    console.error("Error generating BSC:", error);
    return Response.json(
      { message: "BSC generation failed", error },
      { status: 500, statusText: "Internal Server Error" },
    );
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[\/\\:*?"<>|]/g, "-");
}

type PerspectiveGroup = {
  perspective: string;
  percentage: number; // can keep first or sum
  objectives: {
    objective: string;
    percentage: number;
    actions: { action: string }[];
    expectedResults: { result: string }[];
    kpis: { kpi: string }[];
    score: number;
    comments: string;
  }[];
};

function groupByPerspective(bsc: BSCData) {
  const groups: Record<string, PerspectiveGroup> = {};

  for (const obj of bsc.performanceObjectives) {
    if (!groups[obj.perspective]) {
      groups[obj.perspective] = {
        perspective: obj.perspective,
        percentage: 0, // start at 0 and sum later
        objectives: [],
      };
    }

    // add to total percentage for this perspective
    groups[obj.perspective].percentage += obj.percentage;

    // push this objective
    groups[obj.perspective].objectives.push({
      objective: obj.objective,
      percentage: obj.percentage,
      actions: obj.actions.map((a) => ({ action: a })),
      expectedResults: obj.expectedResults.map((r) => ({ result: r })),
      kpis: obj.kpis.map((k) => ({ kpi: k })),
      score: obj.score,
      comments: obj.comments ?? "",
    });
  }

  return Object.values(groups).map((group) => ({
    ...group,
    perspective: perspectives[group.perspective as PerspectiveType],
  }));
}

async function getClients(jobTitle: string): Promise<string[]> {
  const allClients = [
    "Political leaders",
    "Central Government",
    "Public",
    "Employees",
    "NGOs",
    "CSOs",
  ];

  const template = `You are an expert in identifying key clients for public sector job roles. Given a job title, provide a concise list of the most relevant clients (stakeholders) that the role typically serves or interacts with. Focus on high-level clients that are crucial for the role's success.
  {format_instructions}\n{question}
  allClients:
  {allClients}

  jobTitle:
  {jobTitle}
  `;
  try {
    const prompt = ChatPromptTemplate.fromTemplate(template);
    const model = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });
    const parser = StructuredOutputParser.fromZodSchema(z.array(z.string()));
    const retrievalChain = RunnableSequence.from([prompt, model, parser]);
    const response = await retrievalChain.invoke({
      allClients,
      jobTitle,
      format_instructions: parser.getFormatInstructions(),
      question: `From array of ${allClients}, extract the most relevant stakeholders for ${jobTitle}`,
    });
    return response;
  } catch (error) {
    return Response.json("error", { status: 500, statusText: "Error" }) as any;
  }
}
