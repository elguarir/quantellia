import { Button } from "./tailus-ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export const ThemeSwitcher = ({
   size = "md",
}: {
   size?: "md" | "sm" | "xs";
}) => {
   const { setTheme, resolvedTheme } = useTheme();

   const handleThemeChange = () => {
      if (resolvedTheme === "dark") {
         setTheme("light");
      } else {
         setTheme("dark");
      }
   };

   return (
      <Button.Root
         onClick={handleThemeChange}
         aria-label={
            resolvedTheme === "dark"
               ? "Switch to light mode"
               : "Switch to dark mode"
         }
         variant="ghost"
         intent="gray"
         size={size}
         className="relative"
      >
         <Button.Icon
            type="only"
            size={size}
            className="-rotate-180 scale-150 opacity-0 duration-300 dark:rotate-0 dark:scale-100 dark:opacity-100"
         >
            <SunIcon />
         </Button.Icon>
         <Button.Icon
            type="only"
            size={size}
            className="absolute inset-0 duration-300 dark:rotate-180 dark:scale-0 dark:opacity-0"
         >
            <MoonIcon />
         </Button.Icon>
      </Button.Root>
   );
};
