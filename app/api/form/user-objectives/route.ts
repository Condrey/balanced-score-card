import prisma from "@/lib/prisma";
import { organizationContextDataInclude } from "@/lib/types";
import {
  organizationContextPropsSchema,
  stringArraySchema,
} from "@/lib/validations/others";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import z from "zod";

// We shall be getting the following
// NDP programmes for a supervisee
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { financialYear, organizationId, position, ndpProgrammes:targetProgrammes } =
      organizationContextPropsSchema.parse(body);
    if (!targetProgrammes) {
      const errorMessage = "Please provide the NDP programmes first.";
      return Response.json(errorMessage, {
        status: 200,
        statusText: errorMessage,
      });
    }
    const organizationContext = await prisma.organizationContext.findFirst({
      where: { organizationId, financialYear },
      include: organizationContextDataInclude,
    });

    if (!organizationContext) {
      const errorMessage =
        "Failed to get Organization contexts for this year and organization";
      return Response.json(errorMessage, {
        status: 200,
        statusText: errorMessage,
      });
    }

    const { ndp } = organizationContext;
    if (!ndp) {
      const errorMessage =
        "Your organization is missing NDP for the given financial year";
      return Response.json(errorMessage, {
        status: 200,
        statusText: errorMessage,
      });
    }
    const { osps: ndpOsps, } = ndp;
    if (!ndpOsps.length) {
      const errorMessage =
        "Your organization is missing OSPS, please set it to continue";
      return Response.json(errorMessage, {
        status: 200,
        statusText: errorMessage,
      });
    }
    //Ai part
    const template = `You are a JSON-generating assistant. Given the array of NDP objectives (ndpOsps), extract only the strategic objectives whose "programmes" contain at least one of the provided "targetProgrammes".
{format_instructions}\n{question}

ndpOsps:
{ndpOsps}

targetProgrammes:
{targetProgrammes}`;
    const prompt = ChatPromptTemplate.fromTemplate(template);
    const model = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });
    const parser = StructuredOutputParser.fromZodSchema(
      z.array(stringArraySchema)
    );
    const retrievalChain = RunnableSequence.from([prompt, model, parser]);
    const response = await retrievalChain.invoke({
      question: `From array of ${ndpOsps}, extract array's strategicObjective where array's programmes contains any of ${targetProgrammes.map(np=>np.value)}.`,
      format_instructions: parser.getFormatInstructions(),
      ndpOsps,
      targetProgrammes
    });
    return Response.json(response, { statusText: "Success", status: 200 });
  } catch (e) {
    console.error(e);
    const errorMessage = "There was a server error, please try again.";
    return Response.json(errorMessage, {
      status: 500,
      statusText: errorMessage,
    });
  }
}
