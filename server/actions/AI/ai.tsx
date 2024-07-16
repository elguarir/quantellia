"use server";
import ChatMessage from "@/app/dashboard/stories/[id]/_components/chat-message";
import { google } from "@ai-sdk/google";
import { CoreMessage, ToolInvocation } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { Loader2 } from "lucide-react";
import { nanoid } from "nanoid";
import { ReactNode } from "react";

// You are a crypto bot and you can help users get the prices of cryptocurrencies.

//    Messages inside [] means that it's a UI element or a user event. For example:
//    - "[Price of BTC = 69000]" means that the interface of the cryptocurrency price of BTC is shown to the user.
//    - "[Stats of BTC]" means that the interface of the cryptocurrency stats of BTC is shown to the user.
//    If the user wants the price, call \`get_crypto_price\` to show the price.
//    If the user wants the market cap or other stats of a given cryptocurrency, call \`get_crypto_stats\` to show the stats.
//    If the user wants a stock price, it is an impossible task, so you should respond that you are a demo and cannot do that.
//    If the user wants to do anything else, it is an impossible task, so you should respond that you are a demo and cannot do that.

//    Besides getting prices of cryptocurrencies, you can also chat with users.
const systemMessage = `You're a helpful assistant!`;

export async function sendMessage(message: string): Promise<{
   id: string;
   role: "user" | "assistant";
   display: ReactNode;
}> {
   const history = getMutableAIState<typeof AI>();

   history.update([
      ...history.get(),
      {
         role: "user",
         content: message,
      },
   ]);

   const newMessageId = nanoid(8);
   const reply = await streamUI({
      model: google("models/gemini-1.5-flash-latest", {
         safetySettings: [
            {
               category: "HARM_CATEGORY_DANGEROUS_CONTENT",
               threshold: "BLOCK_NONE",
            },
            {
               category: "HARM_CATEGORY_HARASSMENT",
               threshold: "BLOCK_NONE",
            },
            {
               category: "HARM_CATEGORY_HATE_SPEECH",
               threshold: "BLOCK_NONE",
            },
            {
               category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
               threshold: "BLOCK_NONE",
            },
         ],
      }),
      messages: [
         {
            role: "system",
            content: systemMessage,
            toolInvocations: [],
         },
         ...history.get(),
      ] as CoreMessage[],
      initial: (
         <ChatMessage id={nanoid(8)} role="assistant" markdown={false}>
            <Loader2 className="h-5 w-5 animate-spin" />
         </ChatMessage>
      ),
      text: ({ content, done }) => {
         if (done)
            history.done([...history.get(), { role: "assistant", content }]);
         return (
            <ChatMessage role="assistant" markdown={true} id={newMessageId}>
               {content}
            </ChatMessage>
         );
      },
   });

   return {
      id: newMessageId,
      role: "assistant" as const,
      display: reply.value,
   };
}

// Define the AI state and UI state types
export type AIState = Array<{
   id?: string;
   name?: "get_crypto_price" | "get_crypto_stats";
   role: "user" | "assistant" | "system";
   content: string;
}>;

export type UIState = Array<{
   id: string;
   role: "user" | "assistant";
   display: ReactNode;
   toolInvocations?: ToolInvocation[];
}>;

// Create the AI provider with the initial states and allowed actions
export const AI = createAI({
   initialAIState: [] as AIState,
   initialUIState: [] as UIState,
   actions: {
      sendMessage,
   },
});
