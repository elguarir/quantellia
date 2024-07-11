// "use client";
// import { ClerkProvider as BaseProvider } from "@clerk/nextjs";
// import { useTheme } from "next-themes";
// import { dark } from "@clerk/themes";
// import { PropsWithChildren } from "react";

// const ClerkProvider = (props: PropsWithChildren) => {
//     const { resolvedTheme } = useTheme();

//     return (
//         <BaseProvider
//             appearance={{
//                 layout: {
//                     logoImageUrl:
//                         "/images/logo-icon-dark-transparent.png"
//                 },
//                 baseTheme: dark,
//             }}
//         >
//             {props.children}
//         </BaseProvider>
//     );
// };

// export default ClerkProvider;

"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useEffect, type PropsWithChildren, useState } from "react";
import { dark } from "@clerk/themes";

export default function ClerkThemeProvider({ children }: PropsWithChildren) {
   const { resolvedTheme, setTheme } = useTheme();
   const [themeResolved, setThemeResolved] = useState(false);

   // Function to handle theme resolution
   const resolveTheme = () => {
      if (!themeResolved && resolvedTheme !== "system") {
         setThemeResolved(true);
      }
   };

   useEffect(() => {
      resolveTheme();
   }, [resolvedTheme]);

   useEffect(() => {
      if (themeResolved) {
         setTheme(resolvedTheme || "");
      }
   }, [themeResolved, setTheme, resolvedTheme]);

   return (
      <ClerkProvider
         signInUrl="/sign-in"
         signUpUrl="/sign-up"
         afterSignOutUrl={"/"}
         signInFallbackRedirectUrl={"/sign-in"}
         signUpFallbackRedirectUrl={"/sign-up"}
         appearance={{
            baseTheme: resolvedTheme === "dark" ? dark : undefined,
            variables: {
               colorPrimary: "#6366f1",
               colorTextOnPrimaryBackground: "#ffffff",
            },
            layout: {
               logoImageUrl:
                  resolvedTheme === "dark"
                     ? "/images/logo-icon-dark-transparent.png"
                     : "/images/logo-icon-light-transparent.png",
            },
         }}
      >
         {children}
      </ClerkProvider>
   );
}
