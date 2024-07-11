import { hc } from "hono/client";
import { getBaseUrl } from "./utils";
import { AppType } from "@/server/routes";


export const client = hc<AppType>(getBaseUrl());
