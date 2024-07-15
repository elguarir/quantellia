import React from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

const Markdown = async ({ content }: { content: string }) => {
   const html = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .process(content);

      return <div dangerouslySetInnerHTML={{ __html: String(html) }} />;

};

export default Markdown;
