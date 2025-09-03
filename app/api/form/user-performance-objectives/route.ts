import prisma from "@/lib/prisma";
import { positionDataInclude } from "@/lib/types";
import { performanceObjectiveArraySchema } from "@/lib/validations/bsc";
import { organizationContextPropsSchema } from "@/lib/validations/others";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

// We shall be getting the following
// NDP programmes for a supervisee
export async function POST(req: Request) {
  console.log("Requesting plan");
  try {
    const body = await req.json();
    const { position: superviseeId, behavioralAttributes } =
      organizationContextPropsSchema.parse(body);
    if (!superviseeId) {
      const errorMessage = "Please provide the position for the post.";
      return Response.json(errorMessage, {
        status: 200,
        statusText: errorMessage,
      });
    }
    const position = await prisma.position.findFirst({
      where: { id: superviseeId },
      include: positionDataInclude,
    });

    const perspectivesWithPercentages = !behavioralAttributes?.length
      ? [
          { perspective: "STAKEHOLDERS_CLIENTS", percentage: 25 },
          { perspective: "FINANCIAL_STEWARDSHIP", percentage: 15 },
          { perspective: "INTERNAL_PROCESSES", percentage: 20 },
          { perspective: "MDA_LG_CAPACITY", percentage: 20 },
        ]
      : behavioralAttributes.map((b) => ({
          perspective: b.attribute,
          percentage: b.percentage,
        }));

    if (!position) {
      const errorMessage =
        "Sorry, this position was not found, please cross-check and try again.";
      return Response.json(errorMessage, {
        status: 200,
        statusText: errorMessage,
      });
    }

    const { duties } = position;
    if (!duties) {
      const errorMessage = "This position is missing duties.";
      return Response.json(errorMessage, {
        status: 200,
        statusText: errorMessage,
      });
    }

    //Ai part
    const template = `
You are a Balanced Scorecard Maker for Local Governments in Uganda who makes annual BSCs. 
Your role is to generate Balanced Scorecards tailored to the Ugandan local government context.

**Instructions:**
1. Use the provided Job Description Duties (duties) to create Performance Objectives for the specified Position (position).
2. The Balanced Scorecard must include *all* four blueprint perspectives, and each perspective must appear at least **two times** and at most **four times** for senior job positions in the output:
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
    const parser = StructuredOutputParser.fromZodSchema(
      performanceObjectiveArraySchema,
    );
    const retrievalChain = RunnableSequence.from([prompt, model, parser]);
    const response = await retrievalChain.invoke({
      question: `From array of ${duties}, generate the performance objectives with the instructed number of generated perspectives.`,
      format_instructions: parser.getFormatInstructions(),
      duties,
      position,
      perspectivesWithPercentages,
    });
    return Response.json(response, { statusText: "Success", status: 200 });
  } catch (e) {
    console.error(e || "We failed to decode the error");
    const errorMessage = "There was a server error, please try again.";
    return Response.json(errorMessage, {
      status: 500,
      statusText: errorMessage,
    });
  }
}
