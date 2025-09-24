import { PositionData } from "@/lib/types";
import { scheduleOfDutySchema } from "@/lib/validations/others";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

export async function generateScheduleOfDuty({ officer, location }: { officer: PositionData; location: string }) {
	const localGovernmentDuties = officer.duties.map((duty, index) => `${index + 1}. ${duty}`).join("\n");
	const template = `You are an intelligent schedule of duty extractor. Construct the schedule of duty for a given jobTitle from the position  in the given location/facility and also consider their job summary duties
(jobTitle): 
{jobTitle}

(location/facility): 
{location}

(Local government duties):
{localGovernmentDuties}
{format_instructions}`;

	const prompt = ChatPromptTemplate.fromTemplate(template);
	const model = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });
	const parser = StructuredOutputParser.fromZodSchema(scheduleOfDutySchema);
	const retrievalChain = RunnableSequence.from([prompt, model, parser]);
	const response = await retrievalChain.invoke({
		format_instructions: parser.getFormatInstructions(),
		jobTitle: officer.jobTitle,
		location,
		localGovernmentDuties
	});
	return response
}
