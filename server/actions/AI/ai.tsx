"use server";
import ChatMessage from "@/app/dashboard/stories/[id]/_components/chat-message";
import SearchResults from "@/components/stories/search-results";
import { getSearchResults } from "@/lib/helpers";
import { google } from "@ai-sdk/google";
import { CoreMessage, generateText, ToolInvocation } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { Loader2, LucideLoader } from "lucide-react";
import { nanoid } from "nanoid";
import { ReactNode } from "react";
import { z } from "zod";

// You are a crypto bot and you can help users get the prices of cryptocurrencies.
// Messages inside [] means that it's a UI element or a user event. For example:
//    - "[Here are the search results for your query of ...]" means that the interface a grid of search results is shown to the user.
//    If the user wants the price, call \`get_crypto_price\` to show the price.
//    If the user wants the market cap or other stats of a given cryptocurrency, call \`get_crypto_stats\` to show the stats.
//    If the user wants a stock price, it is an impossible task, so you should respond that you are a demo and cannot do that.
//    If the user wants to do anything else, it is an impossible task, so you should respond that you are a demo and cannot do that.

//    Besides getting prices of cryptocurrencies, you can also chat with users.
const systemMessage = `

                        You're a helpful writing buddy, your job is to assist the user in writing their story.
                       - a story is can be a blog post, a book, a script, or any other form of writing.
                       - you can help the user with research, summaries, and more.
                       - the goal here is to help the user write their story, so keep them motivated and on track.
                       - you can also chat with the user to keep them company.
                       - If the there might be a search needed for the user's story or the user asks for it make sure to call the \`get_search_results\` tool to show the search results.
                       `;

export async function sendMessage(message: string): Promise<{
   id: string;
   role: "user" | "assistant";
   display: ReactNode;
}> {
   const model = google("models/gemini-1.5-flash-latest", {
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
   });

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
      model,
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
      tools: {
         searchWeb: {
            description: `Search the web for relevant information, when needed or when the user asks for it.`,
            parameters: z.object({
               query: z
                  .string()
                  .describe("The search query to search the web for."),
            }),
            generate: async function* ({ query }: { query: string }) {
               const newMessageId = nanoid(8);
               yield (
                  <ChatMessage
                     role="assistant"
                     markdown={false}
                     id={newMessageId}
                  >
                     Searching the web for "{query}"...
                  </ChatMessage>
               );

               const results = await getSearchResults(query);
               yield (
                  <ChatMessage
                     role="assistant"
                     markdown={false}
                     id={newMessageId}
                  >
                     <div className="flex flex-col space-y-2">
                        <div>
                           Found {results.length} results for "{query}". <br />
                           generating summaries now...
                        </div>
                        <div>
                           <LucideLoader className="h-5 w-5 animate-spin" />
                        </div>
                     </div>
                  </ChatMessage>
               );

               const summaries = await Promise.all(
                  results.map(async (result) => {
                     const summary = await generateText({
                        model,
                        prompt: `
                        Summarize the following text:
                        \`\`\`
                        - title: ${result.title}
                        - author: ${result.author}
                        - url: ${result.url}
                        - text: ${result.text}
                        `,
                     });
                     return summary.text;
                  }),
               );

               let searchResultsWithSummary = results.map((result, i) => ({
                  title: result.title,
                  url: result.url,
                  text: result.text,
                  author: result.author,
                  publishDate: result.publishedDate,
                  summary: summaries[i],
               }));

               history.done([
                  ...history.get(),
                  {
                     role: "assistant",
                     name: "get_search_results",
                     content: `[Here are the search results for your query of ${query}]`,
                  },
               ]);

               return (
                  <ChatMessage
                     role="assistant"
                     markdown={false}
                     id={newMessageId}
                  >
                     <SearchResults results={searchResultsWithSummary} />
                  </ChatMessage>
               );
            },
         },
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
   name?: "get_search_results";
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
