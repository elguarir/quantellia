import { createClient } from "@deepgram/sdk";

export const dg = createClient(process.env.DEEPGRAM_API_KEY);
