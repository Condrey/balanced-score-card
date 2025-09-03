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
    const {
      financialYear,
      organizationId,
      position: positionId,
    } = organizationContextPropsSchema.parse(body);
    const officer = await prisma.position.findFirst({
      where: { id: positionId },
    });
    const organizationContext = await prisma.organizationContext.findFirst({
      where: { organizationId, financialYear },
      include: organizationContextDataInclude,
    });

    if (!officer) {
      const errorMessage = "Failed to get officer for the given position";
      return Response.json(errorMessage, {
        status: 200,
        statusText: errorMessage,
      });
    }

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
    const { osps: ndpOsps, programmes: ndpProgrammes } = ndp;
    //Ai part
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
    const parser = StructuredOutputParser.fromZodSchema(
      z.array(stringArraySchema),
    );
    const retrievalChain = RunnableSequence.from([prompt, model, parser]);
    const response = await retrievalChain.invoke({
      question: `What NDP programmes applies to the jobTitle of ${officer.jobTitle}? in ${ndpProgrammes} with duties ${officer.duties}`,
      format_instructions: parser.getFormatInstructions(),
      jobTitle: officer.jobTitle,
      ndpProgrammes,
      duties: officer.duties,
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
