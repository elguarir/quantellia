"use client";
import { Button } from "@/components/tailus-ui/button";
import { ArrowDown } from "lucide-react";


interface ScrollToBottomProps {
   onClick: () => void;
}
const ScrollToBottom = (p: ScrollToBottomProps) => {
   return (
      <Button.Root
         variant="outlined"
         intent="gray"
         className="sticky inset-x-0 bottom-[230px] right-5"
         onClick={p.onClick}
      >
         <Button.Icon type="only">
            <ArrowDown />
         </Button.Icon>
      </Button.Root>
   );
};

export default ScrollToBottom;
