import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Use helper to map Better Auth router to Next.js handlers. Provide other verbs
// in case future endpoints leverage them (harmless if unused).
const handlers = toNextJsHandler(auth.handler);
export const GET = handlers.GET;
export const POST = handlers.POST;
