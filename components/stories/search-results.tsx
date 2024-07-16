"use client";
import remarkGfm from "remark-gfm";
import { MemoizedReactMarkdown } from "../chat-markdown";
import { SparkIcon } from "../icons";
import { Button } from "../tailus-ui/button";
import Card from "../tailus-ui/card";
import Dialog from "../tailus-ui/dialog";
import { Caption, Title } from "../tailus-ui/typography";
import remarkMath from "remark-math";
import { format } from "date-fns";
import Badge from "../tailus-ui/badge";

interface SearchResultsProps {
   results: {
      title: string | null;
      url: string;
      text: string;
      author: string | undefined;
      publishDate: string | undefined;
      summary: string;
   }[];
}

const SearchResults = (p: SearchResultsProps) => {
   return (
      <div className="grid w-full grid-cols-1 gap-4">
         {p.results.map((result, i) => (
            <Card variant="mixed" className="divide-y">
               <div className="flex flex-col space-y-2 pb-4">
                  <div>
                     <a href={result.url} target="_blank">
                        <Title>{result.title}</Title>
                     </a>
                  </div>
                  <div className="flex items-center justify-between">
                     <Caption>
                        By:
                        <span className="font-semibold">
                           {result.author?.split(";")[0]}
                        </span>
                     </Caption>
                     {result.publishDate && (
                        <Badge variant="soft" intent="primary">
                           {format(
                              new Date(result.publishDate),
                              "MMM dd, yyyy",
                           )}
                        </Badge>
                     )}
                  </div>
               </div>
               <div className="flex w-full items-end pt-4">
                  <Dialog.Root>
                     <Dialog.Trigger asChild>
                        <Button.Root variant="outlined" intent="gray">
                           <Button.Icon type="leading">
                              <SparkIcon />
                           </Button.Icon>
                           <Button.Label>View Summary</Button.Label>
                        </Button.Root>
                     </Dialog.Trigger>
                     <Dialog.Portal>
                        <Dialog.Overlay className="z-40" />
                        <Dialog.Content
                           mixed
                           className="z-50 max-w-lg focus-visible:outline-none"
                        >
                           <Dialog.Title>{result.title}</Dialog.Title>
                           <Dialog.Description
                              size="sm"
                              className="mt-2 text-[--caption-text-color]"
                           >
                              <MemoizedReactMarkdown
                                 className="prose prose-sm prose-neutral max-h-[550px] overflow-y-auto break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                                 remarkPlugins={[remarkGfm, remarkMath]}
                                 components={{
                                    p({ children }) {
                                       return (
                                          <p className="mb-2 last:mb-0">
                                             {children}
                                          </p>
                                       );
                                    },
                                 }}
                              >
                                 {result.summary}
                              </MemoizedReactMarkdown>
                           </Dialog.Description>
                        </Dialog.Content>
                     </Dialog.Portal>
                  </Dialog.Root>
               </div>
            </Card>
         ))}
      </div>
   );
};

export default SearchResults;
