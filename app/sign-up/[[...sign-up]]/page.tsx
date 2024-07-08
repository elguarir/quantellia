import Loader from "@/components/loader";
import { ClerkLoading, SignUp } from "@clerk/nextjs";

const SignInPage = () => {
   return (
      <div className="container flex min-h-dvh items-center justify-center py-8">
         <ClerkLoading>
            <Loader />
         </ClerkLoading>
         <SignUp />
      </div>
   );
};

export default SignInPage;
