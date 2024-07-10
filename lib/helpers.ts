import axios from "axios";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";
import fetchMetaData from "meta-fetcher";

export const getIdFromVideoLink = (link: string) => {
   let regex =
      /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
   return regex.exec(link)![3];
};

/**
 * Retrieves the audio URL for a given YouTube video URL.
 * @param id - Youtube Video Id or Shorts Id.
 * @throws An error if the audio URL retrieval fails.
 */
interface getYoutubeVideResponse {
   channel: string;
   title: string;
   length: number;
   thumb: string;
   views: number | null;
   url: string;
}
export async function getYoutubeVideo(
   id: string,
): Promise<getYoutubeVideResponse> {
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
      throw new Error("Failed to fetch audio URL");
   }

   const channel = data.channelTitle as string;
   const title = data.title as string;
   const length = parseInt(data.lengthSeconds as string);
   const views = parseInt(data.viewCount as string) ?? null;
   // find last thumbnail
   const thumb = data.thumbnail[data.thumbnail.length - 1].url as string;
   const url = data.formats[0].url as string;

   return {
      channel,
      title,
      length,
      views,
      thumb,
      url,
   };
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
   favicons: string[];

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
   let webpage = await fetchMetaData(url.toString());

   return {
      title: webpage.metadata.title,
      description: webpage.metadata.description ?? null,
      banner: webpage.metadata.banner ?? null,
      favicons: webpage.favicons.map((favicon) =>
         favicon.replace(url.toString(), url.origin + "/"),
      ),
      content,
   };
};
