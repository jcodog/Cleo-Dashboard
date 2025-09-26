import { PrismaClient } from "@/prisma/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

// Helper to instantiate a PrismaClient extended with accelerate
function createDbClient(url: string) {
  return new PrismaClient({ datasourceUrl: url }).$extends(withAccelerate());
}
export type DbClient = ReturnType<typeof createDbClient>;

// Cache Prisma clients by their connection URL on the global object
declare global {
  var prismaClients: Record<string, DbClient> | undefined;
}

export const getDb = (DATABASE_URL: string): DbClient => {
  if (!globalThis.prismaClients) {
    globalThis.prismaClients = {};
  }
  if (!globalThis.prismaClients[DATABASE_URL]) {
    globalThis.prismaClients[DATABASE_URL] = createDbClient(DATABASE_URL);
  }
  return globalThis.prismaClients[DATABASE_URL]!;
};
