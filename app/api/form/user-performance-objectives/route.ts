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
    const { position: superviseeId } =
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
    const template = `You are a Balanced Score Card Maker. Given Job description duties (duties), Create the performance objectives for the position "position".
{format_instructions}\n{question}

duties:
{duties}

position:
{position}`;
    const prompt = ChatPromptTemplate.fromTemplate(template);
    const model = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });
    const parser = StructuredOutputParser.fromZodSchema(
      performanceObjectiveArraySchema
    );
    const retrievalChain = RunnableSequence.from([prompt, model, parser]);
    const response = await retrievalChain.invoke({
      question: `From array of ${duties}, generate the performance objectives.`,
      format_instructions: parser.getFormatInstructions(),
      duties,
      position,
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
