"use client"
import React from "react";
import * as AccordianPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { accordion, type AccordionProps } from "@tailus/themer";

const defaultContextValue:AccordionProps  = {variant : "default", fancy : true};
const Context = React.createContext<AccordionProps>(defaultContextValue);

const AccordianRoot = React.forwardRef<
  React.ElementRef<typeof AccordianPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordianPrimitive.Root> & AccordionProps
  >(({ className, variant, fancy, ...props }, forwardedRef) => {
  const { root } = accordion({variant});
  return (
    <Context.Provider value={{variant, fancy} || defaultContextValue}>
      <AccordianPrimitive.Root
        className={root({className})}
        {...props}
        ref={forwardedRef}
      />
    </Context.Provider>
  )
});

const AccordianItem = React.forwardRef<
  React.ElementRef<typeof AccordianPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordianPrimitive.Item> & AccordionProps
  >(({ className, fancy, ...props }, forwardedRef) => {
  
  const { variant, fancy: contextFancy } = React.useContext(Context);
  const { item } = accordion({ variant }) 

  fancy = fancy || contextFancy;

  if (variant === "soft" && fancy) {
    throw new Error("The fancy style cannot be applied with the 'soft' variant !")
  } 

  return (
    <AccordianPrimitive.Item
      className={item({fancy, className})}
      {...props}
      ref={forwardedRef}
    />
  )
});

const AccordianTrigger = React.forwardRef<
  React.ElementRef<typeof AccordianPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordianPrimitive.Trigger>
>(({className, children, ...props}, forwardedRef) => {
  const {variant} = React.useContext(Context);
  const {header, trigger, triggerIcon, triggerContent} = accordion({variant})

  return (
    <AccordianPrimitive.Header className={header({className})}>
      <AccordianPrimitive.Trigger
        className={trigger({className})}
        {...props}
        ref={forwardedRef}
      >
        <div className={triggerContent({className})}>
          {children}
        </div>
        <ChevronDownIcon className={triggerIcon({className})} aria-hidden={true}/>
      </AccordianPrimitive.Trigger>
    </AccordianPrimitive.Header>
  )
});

const AccordianContent = React.forwardRef<
  React.ElementRef<typeof AccordianPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordianPrimitive.Content>
>(({className, children, ...props}, forwardedRef) => {
  const {variant} = React.useContext(Context);
  const { content } = accordion({variant})

  return (
    <AccordianPrimitive.Content
      className={content({className})}
      {...props}
      ref={forwardedRef}
    >
      <div>
        {children}
      </div>
    </AccordianPrimitive.Content>
  )
});

export { AccordianRoot, AccordianItem, AccordianTrigger, AccordianContent };

