import {
	clerkClient,
	clerkMiddleware,
	createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
	"/",
	"/sign-in(.*)",
	"/sign-up(.*)",
	"/policies(.*)",
]);

const isStaffRoute = createRouteMatcher(["/staff(.*)", "/logs(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	if (!isPublicRoute(req)) {
		await auth.protect();

		if (isStaffRoute(req)) {
			const { userId } = await auth();
			if (!userId) {
				return NextResponse.redirect(new URL("/sign-in", req.url));
			}

			const client = await clerkClient();
			const user = await client.users.getUser(userId);

			const role = user.privateMetadata?.role as string | undefined;

			if (role !== "staff") {
				return NextResponse.redirect(new URL("/dashboard", req.url));
			}
		}
	}
});

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
