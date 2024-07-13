"use client";
import Input from "@/components/tailus-ui/input";
import { button } from "@tailus/themer";
import { LoaderIcon, Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "@uidotdev/usehooks";

interface SearchBarProps {
   initialValue?: string;
}
const SearchBar = (p: SearchBarProps) => {
   const [isPending, startTransition] = useTransition();
   const [searchTerm, setSearchTerm] = useState(p.initialValue);
   const debouncedSearchTerm = useDebounce(searchTerm, 300);
   const router = useRouter();
   const pathname = usePathname();

   useEffect(() => {
      if (debouncedSearchTerm) {
         startTransition(() => {
            router.push(`${pathname}?search=${debouncedSearchTerm}`);
         });
      }
      else {
            startTransition(() => {
                router.push(pathname);
            });
        }
   }, [debouncedSearchTerm]);

   return (
      <div className="relative w-full md:max-w-[32.33%]">
         <Search className="absolute inset-0 left-3 size-4 translate-y-[57%] text-[--placeholder-text-color]" />
         <Input
            value={searchTerm}
            placeholder="Search documents"
            onChange={(e) => {
               setSearchTerm(e.target.value);
            }}
            className="w-full px-9"
         />
         <div className="absolute inset-y-0 right-3 translate-y-[28%] text-[--placeholder-text-color]">
            {isPending && <LoaderIcon className="size-4 animate-spin" />}
         </div>
      </div>
   );
};

export default SearchBar;
