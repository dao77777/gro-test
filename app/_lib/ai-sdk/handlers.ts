import { streamText, tool } from "ai";
import { customAI } from "./custom-ai-provider";

export const handlers = {
  GET: async (req: Request) => { },
  POST: async (req: Request) => {
    const { prompt } = await req.json();

    console.log("[AI] start");

    const result = streamText({
      model: customAI("deepseek-chat"),
      prompt,
      maxTokens: 1000,
      onChunk: (chunk) => {
        console.log('[Chat] chunk');
        console.log('[Chat] ', chunk);
      },
      onError: (error) => {
        console.log('[Chat] error');
        console.error('[Chat] ', error);
      },
      onFinish: (result) => {
        console.log('[Chat] Finish');
        console.log('[Chat] ', result);
      },
      onStepFinish: (step) => {
        console.log('[Chat] Step Finish');
        console.log('[Chat] ', step);
      }
    });

    return result.toDataStreamResponse();
  }
};