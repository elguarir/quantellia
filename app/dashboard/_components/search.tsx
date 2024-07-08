import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/tailus-ui/input";
import { Kbd } from "@/tailus-ui/typography";

export const Search = () => (
   <div className="relative">
      <SearchIcon className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-[--title-text-color] opacity-50" />
      <Input
         variant="outlined"
         size="md"
         className="pl-10"
         placeholder="Search"
      />
      <Kbd className="absolute inset-y-0 right-2 my-auto">CMD+K</Kbd>
   </div>
);
