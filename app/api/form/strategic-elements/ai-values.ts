import prisma from "@/lib/prisma";
import { NdpData, positionDataInclude } from "@/lib/types";
import { stringArraySchema } from "@/lib/validations/others";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { Position } from "@prisma/client";
import z from "zod";

export async function generateAiNdps(officer: Position, ndpProgrammes: string[]) {
	const template = `You are an intelligent array extractor, given an array of NDP programmes, extract the programmes that applies to a job title in a Local Government with job descriptions duties
    (duties)
    {duties}
    
    Be very accurate.
    (ndpProgrammes)
    {ndpProgrammes}

    (jobTitle)
    {jobTitle}

{format_instructions}\n{question}`;

	const prompt = ChatPromptTemplate.fromTemplate(template);
	const model = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });
	const parser = StructuredOutputParser.fromZodSchema(z.array(stringArraySchema));
	const retrievalChain = RunnableSequence.from([prompt, model, parser]);
	const response = await retrievalChain.invoke({
		question: `What NDP programmes applies to the jobTitle of ${officer.jobTitle}? in ${ndpProgrammes} with duties ${officer.duties}`,
		format_instructions: parser.getFormatInstructions(),
		jobTitle: officer.jobTitle,
		ndpProgrammes,
		duties: officer.duties
	});
	return response;
}

export async function generateAiUserObjects({
	ndp,
	targetProgrammes
}: {
	ndp: NdpData;
	targetProgrammes: { id?: string; value: string }[];
}) {
	const { osps: ndpOsps } = ndp;
	const template = `You are a JSON-generating assistant. Given the array of NDP objectives (ndpOsps), extract only the strategic objectives whose "programmes" contain at least one of the provided "targetProgrammes".
    {format_instructions}\n{question}
    
    ndpOsps:
    {ndpOsps}
    
    targetProgrammes:
    {targetProgrammes}`;
	const prompt = ChatPromptTemplate.fromTemplate(template);
	const model = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });
	const parser = StructuredOutputParser.fromZodSchema(z.array(stringArraySchema));
	const retrievalChain = RunnableSequence.from([prompt, model, parser]);
	const response = await retrievalChain.invoke({
		question: `From array of ${ndpOsps}, extract array's strategicObjective where array's programmes contains any of ${targetProgrammes.map((np) => np.value)}.`,
		format_instructions: parser.getFormatInstructions(),
		ndpOsps,
		targetProgrammes
	});
	return response;
}

export async function generateAiUserClients(jobTitle: string): Promise<string[]> {
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

export async function generateAiMandate(jobTitle: string): Promise<string> {
	const positions = await prisma.position.findMany({
		include: positionDataInclude
	});

	//Ai part
	const template = `You are an array content extractor. Construct the  mandate for a given jobTitle from the list of positions.
	(jobTitle): 
	{jobTitle}
	
	(positions): 
	{positions}
	{format_instructions}\n{question}`;

	const prompt = ChatPromptTemplate.fromTemplate(template);
	const model = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });
	const parser = StructuredOutputParser.fromZodSchema(z.string());
	const retrievalChain = RunnableSequence.from([prompt, model, parser]);
	const response = await retrievalChain.invoke({
		question: `What Mandate applies  to the jobTitle of ${jobTitle} in ${positions.map((p) => ({ id: p.id, jobTitle: p.jobTitle, departmentalMandate: p.departmentalMandate }))}?`,
		format_instructions: parser.getFormatInstructions(),
		jobTitle,
		positions: positions.map((p) => ({ id: p.id, jobTitle: p.jobTitle, departmentalMandate: p.departmentalMandate }))
	});
	return response;
}
