import { BSCData } from "@/lib/types";
import { groupByPerspective } from "@/lib/utils";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { put } from "@vercel/blob";
import * as carbone from "carbone";
import * as path from "path";
import z from "zod";

export async function POST(req: Request, res: Response) {
	console.info("Generating BSC document...");
	const body = await req.json();

	const bsc = body as BSCData;

	const clients = !!bsc.clients.length ? bsc.clients : await getClients(bsc.supervisee.jobTitle);
	const perspectiveGroups = groupByPerspective(bsc.performanceObjectives);
	const position = bsc.user?.position || null;
	const scheduleOfDuty = bsc.scheduleOfDuty || null;

	// Carbone expects data as an object
	const data = {
		...bsc,
		perspectiveGroups,
		ndpProgrammes: bsc.ndpProgrammes.map((n) => ({ programme: n })),
		strategicObjectives: bsc.strategicObjectives.map((s) => ({
			objective: s
		})),
		clients: clients.map((c) => ({ client: c })),
		behavioralAttributes: bsc.behavioralAttributes.map((bA, index) => ({
			...bA,
			index: index + 1
		})),
		scheduleOfDuty: !scheduleOfDuty
			? undefined
			: {
					...bsc.scheduleOfDuty,

					clients: scheduleOfDuty.clients.map((c) => ({ client: c })),
					reportingArrangements: scheduleOfDuty.reportingArrangements.map((r) => ({ reportingArrangement: r })),
					guidingDocuments: scheduleOfDuty.guidingDocuments.map((g) => ({ guidingDocument: g })),
					resultAreas: scheduleOfDuty.resultAreas.map((r) => ({ resultArea: r })),
					outputs: scheduleOfDuty.outputActivities.map((oA, index) => ({
						index: `${index + 1}. `,
						output: oA.output
					})),
					activities: scheduleOfDuty.outputActivities
						.map((oA, index) => ({
							index: `${index + 1}. `,
							activities: oA.activities.map((a, aIndex) => ({
								index: `${index + 1}.${aIndex + 1}. `,
								activity: a
							}))
						}))
						.flatMap((b) => b.activities)
				},
		supervisees: !!position ? position.responsibleFor : []
	};
	console.log({
		PerspectiveGroups: data.perspectiveGroups.map((p) => ({ perspective: p.objectives.map((o) => o.objective).flat() }))
	});

	const templatePath = path.resolve(process.cwd(), "public/templates/bsc_template.docx");
	// data.scheduleOfDuty?.clients[0].client
	try {
		const result: Buffer = await new Promise((resolve, reject) => {
			// console.log(JSON.stringify({ data }, null, 2));

			carbone.render(templatePath, data, {}, (err, result) => {
				if (err) {
					console.error("Carbone render error:", err);
					return reject(err);
				}
				resolve(Buffer.from(result));
			});
		});

		// Give a unique fileName
		const fileName = sanitizeFilename(`${bsc.supervisee.name}-bsc_${bsc.year}.docx`);

		// Upload to Blob storage
		const blob = await put(fileName, result, {
			access: "public",
			allowOverwrite: true,
			cacheControlMaxAge: 1
		});

		// return msg
		const msg = `BSC generated successfully for ${bsc.supervisee.name}`;
		return Response.json({ message: msg, url: blob.downloadUrl, isError: false }, { status: 200, statusText: msg });
	} catch (error) {
		console.error("Error generating BSC:", error);
		return Response.json(
			{ message: `BSC generation failed: ${error}`, isError: true },
			{ status: 500, statusText: "Internal Server Error" }
		);
	}
}

function sanitizeFilename(name: string): string {
	return name.replace(/[\/\\:*?"<>|]/g, "-");
}

async function getClients(jobTitle: string): Promise<string[]> {
	const allClients = ["Political leaders", "Central Government", "Public", "Employees", "NGOs", "CSOs"];

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
			question: `From array of ${allClients}, extract the most relevant stakeholders for ${jobTitle}`
		});
		return response;
	} catch (error) {
		return Response.json(
			{ message: "Internal Server Error", isError: true },
			{ status: 500, statusText: "Internal Server Error" }
		) as any;
	}
}
