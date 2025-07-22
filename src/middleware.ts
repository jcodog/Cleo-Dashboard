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
	"/webhooks(.*)",
]);

const isStaffRoute = createRouteMatcher(["/staff(.*)", "/logs(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	if (isPublicRoute(req)) return;

	await auth.protect();

	if (isStaffRoute(req)) {
		const { userId, redirectToSignIn } = await auth();
		if (!userId) {
			return redirectToSignIn({ returnBackUrl: req.nextUrl.href });
		}

		const user = await clerkClient().then((client) =>
			client.users.getUser(userId)
		);
		if (user.privateMetadata?.role !== "staff") {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}
	}
});

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
