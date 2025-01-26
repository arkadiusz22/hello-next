import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { prisma as prismaAdapter } from "@lucia-auth/adapter-prisma";
import { prismaClient } from "../lib/prismaClient";

export const auth = lucia({
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  adapter: prismaAdapter(prismaClient),

  getUserAttributes: (data) => {
    return {
      name: data.name,
      email: data.email,
    };
  },
});

export type Auth = typeof auth;
