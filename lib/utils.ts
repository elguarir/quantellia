import { type ClassValue, clsx } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function cloneElement(element: React.ReactElement, classNames: string) {
   return React.cloneElement(element, {
      className: twMerge(element.props.className, classNames),
   });
}
