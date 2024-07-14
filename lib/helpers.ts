import axios from "axios";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";
import Replicate from "replicate";



/**
 * Retrieves the audio URL for a given YouTube video URL.
 * @param id - Youtube Video Id or Shorts Id.
 * @throws An error if the audio URL retrieval fails.
 */
interface getYoutubeVideResponse {
   channel: string;
   title: string;
   description: string | null;
   length: number;
   thumb: string;
   views: number | null;
}

export async function getYoutubeVideoDetails(
   id: string,
): Promise<getYoutubeVideResponse> {
   const options = {
      method: "GET",
      url: "https://yt-api.p.rapidapi.com/video/info",
      params: { id },
      headers: {
         "x-rapidapi-key": process.env.YOUTUBE_API_KEY as string,
         "x-rapidapi-host": "yt-api.p.rapidapi.com",
      },
   };

   const { data } = await axios.request(options);
   if (data.error) {
      throw new Error("Failed to load youtube video.");
   }

   if (data.isUnlisted || data.isPrivate) {
      throw new Error("Video is private or unavailable");
   }

   const channel = data.channelTitle as string;
   const title = data.title as string;
   const description = (data.description as string) ?? null;
   const length = parseInt(data.lengthSeconds as string);
   const views = parseInt(data.viewCount as string) ?? null;
   // find last thumbnail
   const thumb = data.thumbnail[data.thumbnail.length - 1].url as string;

   return {
      channel,
      title,
      description,
      length,
      views,
      thumb,
   };
}

export async function getYoutubeVideoUrl(id: string): Promise<string> {
   const options = {
      method: "GET",
      url: "https://yt-api.p.rapidapi.com/dl",
      params: { id },
      headers: {
         "x-rapidapi-key": process.env.YOUTUBE_API_KEY as string,
         "x-rapidapi-host": "yt-api.p.rapidapi.com",
      },
   };

   const { data } = await axios.request(options);

   if (data.status !== "OK") {
      throw new Error("Failed to load youtube video.");
   }

   if (data.isUnlisted || data.isPrivate) {
      throw new Error("Video is private or unavailable");
   }

   return data.formats[0].url as string;
}

/**
 * Represents the response of parsing a web page.
 */
interface parseWebPageResponse {
   /**
    * The title of the web page.
    * Can be null if no title is found.
    */
   title: string | null;

   /**
    * The description of the web page.
    * Can be null if no description is found.
    */
   description: string | null;

   /**
    * The banner image of the web page.
    * Can be null if no banner image is found.
    */
   banner: string | null;

   /**
    * The favicons of the web page.
    */
   favicon: string;

   /**
    * The content of the web page.
    */
   content: string;
}

export const parseWebPage = async (url: URL): Promise<parseWebPageResponse> => {
   const downloadedPage = await (await fetch(url)).text();
   const doc = new JSDOM(downloadedPage, {
      url: url.toString(),
   });
   const reader = new Readability(doc.window.document);
   const article = reader.parse();
   const html = article?.content ?? "";
   const turndownService = new TurndownService({
      headingStyle: "atx",
   });
   let content = turndownService.turndown(html);

   const { data } = await axios.get(
      `https://metatags.io/api/hello?url=${url.toString()}`,
   );

   const title = data.title as string;
   const description = data.description as string;
   const banner = data.image as string;
   const favicon = data.favicon as string;

   return {
      title,
      description,
      banner,
      favicon,
      content,
   };
};


export const embedTexts = async (texts: string[]) => {
   const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
   });

   const output = (await replicate.run(
      "replicate/all-mpnet-base-v2:b6b7585c9640cd7a9572c6e129c9549d79c9c31f0d3fdce7baac7c67ca38f305",
      {
         input: {
            text_batch: JSON.stringify(texts),
         },
      },
   )) as { embedding: number[] }[];
   return output.map((item) => {
      return item.embedding;
   });
};
