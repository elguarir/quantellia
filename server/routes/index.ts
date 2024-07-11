import { Hono } from "hono";
import documents from "./documents";
import webhooks from "./webhooks";

const app = new Hono().basePath("/api/v1");

const routes = app.route("/documents", documents).route("/webhooks", webhooks);

export type AppType = typeof routes;
export { app };
