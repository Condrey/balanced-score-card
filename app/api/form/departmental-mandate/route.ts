import prisma from "@/lib/prisma";
import { positionDataInclude } from "@/lib/types";
import { organizationContextPropsSchema } from "@/lib/validations/others";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import z from "zod";

// We shall be getting the following
// NDP programmes for a supervisee
export async function POST(req: Request) {
	console.log("Received request for departmental mandate");
	try {
		const body = await req.json();
		const { position: jobTitle } = organizationContextPropsSchema.parse(body);
		const positions = await prisma.position.findMany({
			include: positionDataInclude
		});

		if (!positions) {
			const errorMessage = "Failed to get positions for this year and organization";
			return Response.json(errorMessage, {
				status: 200,
				statusText: errorMessage
			});
		}
		//Ai part
		const template = `You are an array content extractor.Construct the departmental mandate for a given jobTitle from the list of positions.
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
			question: `What departmentalMandate applies  to the jobTitle of ${jobTitle} in ${positions}?`,
			format_instructions: parser.getFormatInstructions(),
			jobTitle,
			positions
		});
		console.log("response", response);
		return Response.json(response, { statusText: "Success", status: 200 });
	} catch (e) {
		console.error(e);
		const errorMessage = "There was a server error, please try again.";
		return Response.json(errorMessage, {
			status: 500,
			statusText: errorMessage
		});
	}
}
