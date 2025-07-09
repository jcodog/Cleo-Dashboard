import { PrismaClient } from "../prisma/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const getDb = (DATABASE_URL: string) => {
	return new PrismaClient({
		datasourceUrl: DATABASE_URL,
	}).$extends(withAccelerate());
};
