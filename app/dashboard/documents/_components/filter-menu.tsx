"use client";
import { Button } from "@/components/tailus-ui/button";
import { Filter, X } from "lucide-react";
import Popover from "@/components/tailus-ui/popover";
import { Title } from "@/components/tailus-ui/typography";
import Checkbox from "@/tailus-ui/checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import Label from "@/components/tailus-ui/label";
import { parseAsArrayOf, parseAsStringEnum, useQueryState } from "nuqs";
import { useTransition } from "react";
import { Types } from "@/lib/constants";

interface FilterMenuProps {
   defaultFilter?: Types[];
}
const FilterMenu = (p: FilterMenuProps) => {
   const [_, startTransition] = useTransition();

   const [filter, setFilter] = useQueryState(
      "filter",
      parseAsArrayOf(parseAsStringEnum<Types>(Object.values(Types)), ",")
         .withOptions({
            clearOnDefault: true,
            startTransition,
            shallow: false,
         })
         .withDefault(p.defaultFilter ?? []),
   );
   console.log(filter);

   const filters = [
      { label: "Videos", value: Types.YoutubeVideo },
      { label: "Files", value: Types.File },
      { label: "Web Pages", value: Types.WebPage },
   ];

   return (
      <>
         <Popover.Root>
            <Popover.Trigger asChild>
               <Button.Root variant="outlined" intent="gray">
                  <Button.Icon type="leading">
                     <Filter />
                  </Button.Icon>
                  <Button.Label>Filter</Button.Label>
               </Button.Root>
            </Popover.Trigger>
            <Popover.Portal>
               <Popover.Content
                  mixed
                  className="mt-2 w-48 px-6 pb-3 pl-4 pt-2 focus-visible:outline-none"
                  align="end"
               >
                  <Title size="base" as="div" weight="medium">
                     Filter
                  </Title>
                  {/* <Text className="mb-0 mt-2"></Text> */}
                  <div className="flex w-full flex-col space-y-1 pt-3">
                     {filters.map((f) => (
                        <Label
                           key={f.value}
                           className="flex items-center gap-1.5"
                        >
                           <Checkbox.Root
                              intent="neutral"
                              defaultChecked={p.defaultFilter?.includes(
                                 f.value,
                              )}
                              checked={filter.includes(f.value)}
                              onCheckedChange={(checked) => {
                                 console.log(checked);
                                 setFilter((prev) => {
                                    if (checked) {
                                       return [...prev, f.value];
                                    } else {
                                       return prev.filter(
                                          (item) => item !== f.value,
                                       );
                                    }
                                 });
                              }}
                           >
                              <Checkbox.Indicator asChild>
                                 <CheckIcon
                                    className="size-3.5"
                                    strokeWidth={3}
                                 />
                              </Checkbox.Indicator>
                           </Checkbox.Root>
                           {f.label}
                        </Label>
                     ))}
                  </div>
                  <Popover.Close asChild>
                     <button className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-1">
                        <X className="size-4 text-[--caption-text-color] transition-colors duration-300 hover:text-foreground" />
                     </button>
                  </Popover.Close>
               </Popover.Content>
            </Popover.Portal>
         </Popover.Root>
      </>
   );
};

export default FilterMenu;
