"use client";
import React, {
   useRef,
   useEffect,
   createContext,
   useContext,
   useState,
   ReactNode,
} from "react";
import { Button } from "@/components/tailus-ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Display, Text, Title } from "@/tailus-ui/typography";
import { Lock, Plus, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/logo";
import {
   ClerkLoading,
   SignInButton,
   SignUpButton,
   SignedIn,
   SignedOut,
} from "@clerk/nextjs";
import { LoadingDots } from "@/components/loading-dots";
import Link from "next/link";

type NavLink = {
   href: string;
   label: string;
};

const links: NavLink[] = [
   { href: "#", label: "Features" },
   { href: "#", label: "Pricing" },
   { href: "#", label: "Blog" },
   { href: "#", label: "Contact" },
];

type NavContextType = {
   isOpen: boolean;
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
   isActionActive: boolean;
};

const NavContext = createContext<NavContextType | undefined>(undefined);

const useNav = () => {
   const context = useContext(NavContext);
   if (!context) {
      throw new Error("useNav must be used within a NavProvider");
   }
   return context;
};

const NavProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [isOpen, setIsOpen] = useState(false);
   const [isActionActive, setIsActionActive] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
         setIsActionActive(window.scrollY > 75);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <NavContext.Provider value={{ isOpen, setIsOpen, isActionActive }}>
         {children}
      </NavContext.Provider>
   );
};

const NavLink: React.FC<NavLink & { isActive?: boolean }> = ({
   href,
   label,
   isActive,
}) => (
   <Button.Root
      variant={isActive ? "soft" : "ghost"}
      intent="gray"
      size="xs"
      className="h-10 justify-start lg:h-7"
   >
      <Link href={href}>
         <Button.Label>{label}</Button.Label>
      </Link>
   </Button.Root>
);

const SiteHeader: React.FC = () => {
   const { isOpen, setIsOpen, isActionActive } = useNav();
   const [isMounted, setIsMounted] = useState(false);

   const navItemsRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      // client.api.v1.documents.

      setIsMounted(true);
   }, []);

   useEffect(() => {
      const root = document.body;
      const navItems = navItemsRef.current;

      if (isOpen && navItems) {
         navItems.style.setProperty(
            "--nav-items-height",
            `${navItems.scrollHeight}px`,
         );
         root.classList.add("overflow-hidden");
      } else if (navItems) {
         root.classList.remove("overflow-hidden");
         navItems.style.setProperty("--nav-items-height", "0px");
      }
   }, [isOpen]);

   return (
      <>
         <header
            data-state={isOpen ? "open" : "closed"}
            data-shade="glassy"
            className="group card-shadow fixed inset-x-2 top-2 z-20 rounded border bg-white/50 dark:border-white/5 dark:bg-white/5 lg:relative lg:inset-x-0 lg:top-4 lg:rounded-none lg:border-0 lg:bg-transparent lg:shadow-none lg:dark:bg-transparent"
            style={{ backdropFilter: "blur(20px)" }}
         >
            {/* Header content */}
            <div className="mx-auto max-w-6xl px-6 py-3 sm:py-4 lg:flex lg:justify-between">
               <div className="lg:flex lg:items-center lg:gap-8">
                  {/* Logo and mobile menu button */}
                  <div className="flex w-full items-center justify-between lg:w-fit">
                     <a
                        href="/"
                        aria-label="home"
                        className="flex items-center gap-2"
                     >
                        <Logo className="h-8 lg:h-10" />
                     </a>
                     <div className="flex gap-2 lg:hidden">
                        <ClerkLoading>
                           <Button.Root
                              size="sm"
                              className="w-[70px]"
                              intent="neutral"
                           >
                              <Button.Label className="flex h-full items-center">
                                 <LoadingDots />
                              </Button.Label>
                           </Button.Root>
                        </ClerkLoading>
                        <SignedOut>
                           <SignInButton mode="modal">
                              <Button.Root size="sm" intent="neutral">
                                 <Button.Label>Sign in</Button.Label>
                              </Button.Root>
                           </SignInButton>
                        </SignedOut>
                        <SignedIn>
                           <Button.Root size="sm" intent="neutral" asChild>
                              <Link href="/dashboard">
                                 <Button.Label>Dashboard</Button.Label>
                              </Link>
                           </Button.Root>
                        </SignedIn>

                        <Button.Root
                           onClick={() => setIsOpen(!isOpen)}
                           intent="gray"
                           size="sm"
                           variant="ghost"
                           aria-label="toggle menu button"
                           className="relative -mr-3"
                        >
                           <Button.Icon
                              size="md"
                              type="only"
                              className="absolute inset-0 m-auto -rotate-90 scale-125 opacity-0 duration-300 group-data-[state=open]:rotate-90 group-data-[state=open]:scale-100 group-data-[state=open]:opacity-100"
                           >
                              <X />
                           </Button.Icon>
                           <Button.Icon
                              size="md"
                              type="only"
                              className="duration-300 group-data-[state=open]:rotate-90 group-data-[state=open]:scale-0"
                           >
                              <Menu />
                           </Button.Icon>
                        </Button.Root>
                     </div>
                  </div>
                  {/* Navigation items */}
                  <nav
                     ref={navItemsRef}
                     className={cn(
                        "-mx-3 h-[--nav-items-height] w-full overflow-hidden transition-[height] lg:feedback-shadow lg:fixed lg:inset-x-0 lg:top-6 lg:m-auto lg:mx-auto lg:flex lg:h-fit lg:w-fit lg:rounded lg:border lg:bg-white/50 lg:px-2 lg:py-2 lg:backdrop-blur-3xl lg:dark:border-white/5 lg:dark:bg-white/5",
                        navItemsRef.current
                           ? "h-[var(--nav-items-height,0px)]"
                           : "h-0 lg:h-auto",
                     )}
                  >
                     {/* Navigation dots */}
                     {[...Array(4)].map((_, index) => (
                        <div
                           key={index}
                           className={`absolute size-1 rounded-full bg-gray-950/10 dark:bg-white/20 lg:size-0.5 ${
                              index === 0
                                 ? "left-1.5 top-1.5 lg:left-1 lg:top-1"
                                 : index === 1
                                   ? "right-1.5 top-1.5 lg:right-1 lg:top-1"
                                   : index === 2
                                     ? "bottom-1.5 left-1.5 lg:bottom-1 lg:left-1"
                                     : "bottom-1.5 right-1.5 lg:bottom-1 lg:right-1"
                           }`}
                           aria-hidden
                        />
                     ))}
                     <div
                        className={cn(
                           "space-y-2 py-4 lg:mr-1 lg:flex lg:gap-1 lg:space-y-0 lg:py-0",
                           isActionActive && "lg:mr-2",
                        )}
                     >
                        {links.map((link) => (
                           <NavLink key={link.label} {...link} />
                        ))}
                     </div>
                  </nav>
               </div>
               {/* Desktop sign-in and theme switcher */}
               <div className="hidden items-center gap-4 lg:flex">
                  <ClerkLoading>
                     <Button.Root
                        size="xs"
                        intent="gray"
                        variant="outlined"
                        className="w-[70px]"
                     >
                        <Button.Label className="flex h-full items-center">
                           <LoadingDots />
                        </Button.Label>
                     </Button.Root>
                  </ClerkLoading>
                  <SignedOut>
                     <SignInButton mode="modal">
                        <Button.Root size="xs" intent="gray" variant="outlined">
                           <Button.Label>Sign in</Button.Label>
                        </Button.Root>
                     </SignInButton>
                  </SignedOut>
                  <SignedIn>
                     <Button.Root
                        size="xs"
                        intent="gray"
                        variant="outlined"
                        asChild
                     >
                        <Link href="/dashboard">
                           <Button.Label>Dashboard</Button.Label>
                        </Link>
                     </Button.Root>
                  </SignedIn>
                  <ThemeSwitcher size="sm" />
               </div>
            </div>
         </header>
         {/* Mobile overlay */}
         {isMounted && isOpen && (
            <div
               onClick={() => setIsOpen(false)}
               className="fixed inset-0 z-[9] animate-overlayShow bg-white/50 dark:bg-[--overlay-bg] lg:hidden"
               aria-hidden
            />
         )}
      </>
   );
};

const ShowcaseImage: React.FC = () => (
   <div
      data-shade="950"
      data-rounded="2xlarge"
      className="mx-auto mb-12 mt-12 rounded-[--card-radius] p-px shadow-xl shadow-gray-950/5 dark:border-transparent dark:shadow-gray-950/50 sm:mb-16 sm:mt-20 md:mb-20"
   >
      <div className="space-y-1 rounded-[calc(var(--card-radius)-1px)] border bg-[--ui-bg] p-1 backdrop-blur-2xl">
         <div className="flex items-center justify-between px-3">
            <div className="flex gap-1.5">
               {[...Array(3)].map((_, index) => (
                  <div
                     key={index}
                     aria-hidden
                     className="size-2 rounded-full border border-gray-300 bg-gray-200/50 dark:border-white/5 dark:bg-white/10"
                  />
               ))}
            </div>
            <div
               data-rounded="large"
               className="relative flex h-6 w-56 items-center justify-center gap-4 rounded-[--card-radius] bg-gray-200/50 px-3 text-xs text-[--caption-text-color] dark:bg-[--ui-bg]"
            >
               <Lock className="absolute left-3 size-2.5" />
               quantellia.net
            </div>
            <Plus aria-hidden className="size-4 text-[--caption-text-color]" />
         </div>
         <img
            className="aspect-[4/3] rounded-[calc(var(--card-radius)-5px)] border dark:hidden"
            src="/img.png"
            alt=""
         />
         <img
            className="hidden aspect-[4/3] rounded-[calc(var(--card-radius)-5px)] border dark:block"
            src="/img.png"
            alt=""
         />
      </div>
   </div>
);

export default function HomePage() {
   return (
      <NavProvider>
         <SiteHeader />
         <img
            className="absolute inset-0 hidden -scale-x-100 scale-y-125 opacity-15 blur-lg contrast-150 grayscale hue-rotate-180 dark:block lg:-top-1/4"
            src="/images/gradient.webp"
            alt=""
            aria-hidden
         />
         <div
            className="absolute inset-0 hidden bg-gradient-to-b from-primary-950/50 dark:block"
            aria-hidden
         />
         <main className="relative">
            <section className="pb-40 pt-32 md:pt-40 lg:pt-20">
               <div className="mx-auto max-w-6xl px-6">
                  <Display
                     align="center"
                     style={{
                        fontFamily: "inter, var(--font-geist-sans)",
                     }}
                     className="text-balance bg-gradient-to-br from-primary-950 from-30% to-primary-950/60 bg-clip-text py-6 text-center text-4xl font-semibold leading-none tracking-tighter text-transparent dark:from-primary-100 dark:to-primary-100/40 sm:text-6xl md:text-7xl lg:text-7xl"
                  >
                     Whisper a Question, Hear the World's Knowledge
                  </Display>
                  <Text
                     className="mx-auto mb-8 mt-6 max-w-xl"
                     size="lg"
                     align="center"
                  >
                     Provident quo nobis dolor vitae similique tenetur
                     praesentium omnis fugiat provident quidem maiores voluptate
                     iste rerum.
                  </Text>
                  <div className="mx-auto w-fit rounded-[calc(var(--btn-radius)+4px)] border border-gray-950/5 p-1 dark:border-white/5 dark:bg-white/5 dark:shadow-lg dark:shadow-white/5">
                     <ClerkLoading>
                        <Button.Root className="w-[84px]">
                           <Button.Label className="flex h-full items-center">
                              <LoadingDots />
                           </Button.Label>
                        </Button.Root>
                     </ClerkLoading>
                     <SignedOut>
                        <SignUpButton mode="modal">
                           <Button.Root>
                              <Button.Label>Get started</Button.Label>
                           </Button.Root>
                        </SignUpButton>
                     </SignedOut>

                     <SignedIn>
                        <Button.Root>
                           <Link href="/dashboard">
                              <Button.Label>Dashboard</Button.Label>
                           </Link>
                        </Button.Root>
                     </SignedIn>
                  </div>
                  <div className="mx-auto mt-12 max-w-3xl md:mt-20">
                     <Title size="base" align="center" as="div" weight="medium">
                        Used by Teams at
                     </Title>
                     <Title as="h2" className="sr-only">
                        Customers
                     </Title>
                     <div className="mt-6 flex flex-wrap items-center justify-center gap-6 brightness-0 grayscale dark:invert sm:gap-x-12 md:gap-x-20">
                        {["lilly.png", "ge.svg", "microsoft.svg"].map(
                           (image, index) => (
                              <img
                                 key={index}
                                 src={`https://ampire.netlify.app/images/clients/${image}`}
                                 alt=""
                                 className={`h-${
                                    index === 1 ? "8" : index === 2 ? "10" : "9"
                                 } w-auto`}
                              />
                           ),
                        )}
                     </div>
                  </div>
                  <ShowcaseImage />
               </div>
            </section>
         </main>
      </NavProvider>
   );
}
