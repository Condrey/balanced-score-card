import { PositionData } from "@/lib/types";
import { performanceObjectiveArraySchema } from "@/lib/validations/bsc";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

export async function generateAiPerformancePlan({
	position,
	duties,
	behavioralAttributes
}: {
	position: PositionData;
	duties: string[];
	behavioralAttributes:
		| {
				attribute: string;
				percentage: number;
				description: string;
				score: number;
				id?: string | undefined;
				commentsJustification?: string | undefined;
		  }[]
		| undefined;
}) {
	const perspectivesWithPercentages = !behavioralAttributes?.length
		? [
				{ perspective: "STAKEHOLDERS_CLIENTS", percentage: 25 },
				{ perspective: "FINANCIAL_STEWARDSHIP", percentage: 15 },
				{ perspective: "INTERNAL_PROCESSES", percentage: 20 },
				{ perspective: "MDA_LG_CAPACITY", percentage: 20 }
			]
		: behavioralAttributes.map((b) => ({
				perspective: b.attribute,
				percentage: b.percentage
			}));
	const template = `
You are a Balanced Scorecard Maker for Local Governments in Uganda who makes annual BSCs. 
Your role is to generate Balanced Scorecards tailored to the Ugandan local government context.

**Instructions:**
1. Use the provided Job Description Duties (duties) to create Performance Objectives for the specified Position (position).
2. The Balanced Scorecard must include *all* four blueprint perspectives, and each perspective MUST appear **four times** in the following output perspective:
   - STAKEHOLDERS_CLIENTS
   - FINANCIAL_STEWARDSHIP
   - INTERNAL_PROCESSES
   - MDA_LG_CAPACITY
   There is a tendency for the AI to forget FINANCIAL_STEWARDSHIP, take note.
3. These are the blueprint perspectives with their maximum allowable percentages:  
   {perspectivesWithPercentages}
4. Ensure the total percentage of objectives under each perspective does **not exceed** its allotted percentage.  
5. If the draft misses 1 or more objectives for a given perspective, smartly add them to ensure every perspective is represented at least twice.  
6. Distribute percentages realistically and fairly across objectives.  
7. Output must strictly follow the required format.  

{format_instructions}

{question}

Duties:  
{duties}

Position:  
{position}
`;

	const prompt = ChatPromptTemplate.fromTemplate(template);
	const model = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });
	const parser = StructuredOutputParser.fromZodSchema(performanceObjectiveArraySchema);
	const retrievalChain = RunnableSequence.from([prompt, model, parser]);
	const response = await retrievalChain.invoke({
		question: `From array of ${duties}, generate the performance objectives with the instructed number of generated perspectives.`,
		format_instructions: parser.getFormatInstructions(),
		duties,
		position,
		perspectivesWithPercentages
	});
	return response;
}
