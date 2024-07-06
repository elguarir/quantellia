import { Inngest, InngestMiddleware } from "inngest";
import { db } from "@/lib/db";

// make Prisma available in the Inngest functions
const prismaMiddleware = new InngestMiddleware({
    name: "Prisma Middleware",
    init() {
        return {
            onFunctionRun(ctx) {
                return {
                    transformInput(ctx) {
                        return {
                            // Anything passed via `ctx` will be merged with the function's arguments
                            ctx: {
                                db,
                            },
                        };
                    },
                };
            },
        };
    },
});

// Create a client to send and receive events
export const inngest = new Inngest({
    id: "fluent-script",
    middleware: [prismaMiddleware],
    
});
