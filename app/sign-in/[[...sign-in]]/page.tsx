"use client";
import Loader from "@/components/loader";
import { ClerkLoading, SignIn } from "@clerk/nextjs";

const SignInPage = () => {
   return (
      <div className="container flex min-h-dvh items-center justify-center py-8">
         <ClerkLoading>
               <Loader />
         </ClerkLoading>
         <SignIn />
      </div>
   );
};

export default SignInPage;
