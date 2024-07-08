import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(
   (auth, req) => {
      if (auth().userId && isAuthRoute(req))
         return NextResponse.redirect(new URL("/dashboard", req.url));

      if (isProtectedRoute(req)) auth().protect();
   },
   {
      afterSignInUrl: "/dashboard",
      afterSignUpUrl: "/onboarding",
      signInUrl: "/sign-in",
      signUpUrl: "/sign-up",
   },
);

export const config = {
   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
