import { DbClient } from "@/lib/prisma";
import type Stripe from "stripe";

// Shared lightweight interfaces to replace scattered `any` in routers
export interface DomainUser {
  id: string;
  extId: string;
  discordId: string | null;
  kickId: string | null;
  email?: string | null;
  username?: string | null;
  name?: string | null;
  customerId?: string | null;
}

export interface RequestSessionUser {
  id: string;
  email?: string | null;
  name?: string | null;
}

export interface RequestSession {
  user: RequestSessionUser;
}

export interface RouterContextBase {
  db: DbClient;
  session: RequestSession;
}

export interface DashContext extends RouterContextBase {
  user: DomainUser;
  accessToken?: string;
  stripe?: Stripe;
}

export type AuthContext = RouterContextBase;
