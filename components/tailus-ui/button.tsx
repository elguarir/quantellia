import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cloneElement } from "@/lib/utils";
import {
   button,
   buttonIcon as icon,
   type ButtonProps as ButtonVariantsProps,
   type ButtonIconProps,
} from "@tailus/themer";

export type Root = typeof Root;
export type Icon = typeof Icon;
export type Label = typeof Label;

export interface ButtonProps
   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
      ButtonVariantsProps {
   asChild?: boolean;
}

export interface IconProps
   extends React.HTMLAttributes<HTMLElement>,
      ButtonIconProps {}

export const Icon: React.FC<IconProps> = ({
   className,
   children,
   size = "md",
   type = "leading",
}) => {
   return (
      <>
         {cloneElement(
            children as React.ReactElement,
            icon({ size, type, className }),
         )}
      </>
   );
};

export const Label = React.forwardRef<
   HTMLElement,
   React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, forwardedRef) => {
   return (
      <span className={className} {...props} ref={forwardedRef}>
         {children}
      </span>
   );
});

export const Root = React.forwardRef<HTMLButtonElement, ButtonProps>(
   (
      {
         className,
         intent = "primary",
         variant = "solid",
         size = "md",
         children,
         asChild = false,
         ...props
      },
      forwardedRef,
   ) => {
      const Component = asChild ? Slot : "button";
      const iconOnly = React.Children.toArray(children).some(
         (child) =>
            React.isValidElement(child) &&
            child.type === Icon &&
            child.props.type === "only",
      );
      const buttonSize = iconOnly ? "iconOnlyButtonSize" : "size";

      return (
         <Component
            ref={forwardedRef}
            className={button[variant as keyof typeof button]({
               intent,
               [buttonSize]: size,
               className,
            })}
            {...props}
         >
            {children}
         </Component>
      );
   },
);

Root.displayName = "Root";
Icon.displayName = "Icon";
Label.displayName = "Label";

export const Button = {
   Root: Root,
   Icon: Icon,
   Label: Label,
};
