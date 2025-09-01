import { BSCData } from "@/lib/types";
import * as carbone from "carbone";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const bsc = body as BSCData;

    const templatePath = path.resolve(
      process.cwd(),
      "public/templates/bsc_template.docx",
    );

    const perspectiveGroups = groupByPerspective(bsc);
    // Carbone expects data as an object
    const data = {
      ...bsc,
      perspectiveGroups,
      ndpProgrammes: bsc.ndpProgrammes.map((n) => ({ programme: n })),
      strategicObjectives: bsc.strategicObjectives.map((s) => ({
        objective: s,
      })),
    };

    // Render DOCX using Carbone
    carbone.render(templatePath, data, {}, (err, result) => {
      if (err) {
        return Response.json(
          { message: "BSC generation failed", error: err },
          { status: 500, statusText: "Internal Server Error" },
        );
      }

      // Save output file
      const downloadsPath = path.join(os.homedir(), "Downloads");
      if (!fs.existsSync(downloadsPath))
        fs.mkdirSync(downloadsPath, { recursive: true });

      const fileName = sanitizeFilename(
        `bsc ${bsc.supervisee.name} ${bsc.year}.docx`,
      );
      const outputPath = path.join(downloadsPath, fileName);
      fs.writeFileSync(outputPath, result);
    });
    const msg = `BSC generated successfully for ${bsc.supervisee.name}`;
    return Response.json('success', { status: 200, statusText: msg });
  } catch (error) {
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
        percentage: obj.percentage, // or compute total percentage if needed
        objectives: [],
      };
    }

    groups[obj.perspective].objectives.push({
      objective: obj.objective,
      percentage: obj.percentage,
      actions: obj.actions.map((a) => ({ action: a })),
      expectedResults: obj.expectedResults.map((r) => ({ result: r })),
      kpis: obj.kpis.map((k) => ({ kpi: k })),
      score: obj.score,
      comments: obj.comments!,
    });
  }

  return Object.values(groups);
}
