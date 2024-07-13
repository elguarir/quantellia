import axios from "axios";
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

export function getBaseUrl() {
   if (typeof window !== "undefined") return window.location.origin;
   if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
   return `http://localhost:${process.env.PORT ?? 3000}`;
}

export type UploadFunctionProps = {
   file: File;
   url: string;
   onStart?: () => void;
   onProgress: (progress: number) => void;
   onError: (error: Error) => void;
   onSuccess?: () => void;
};

export const uploadFile = async (props: UploadFunctionProps) => {
   try {
      props.onStart?.();
      await axios.put(props.url, props.file, {
         headers: {
            "Content-Type": props.file.type,
         },
         onUploadProgress: (progressEvent) => {
            if (progressEvent.total !== undefined) {
               const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total,
               );
               props.onProgress(progress);
            }
         },
      });
      props.onSuccess?.();
      return { success: true };
   } catch (error) {
      if (error instanceof Error) {
         console.error("Error uploading file:", error);
         props.onError(error);
      }
      return { success: false };
   }
};

export function formatBytes(
   bytes: number,
   opts: {
      decimals?: number;
      sizeType?: "accurate" | "normal";
   } = {},
) {
   const { decimals = 0, sizeType = "normal" } = opts;

   const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
   const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
   if (bytes === 0) return "0 Byte";
   const i = Math.floor(Math.log(bytes) / Math.log(1024));
   return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
      sizeType === "accurate"
         ? accurateSizes[i] ?? "Bytest"
         : sizes[i] ?? "Bytes"
   }`;
}

export function decodeDoubleEncodedUriComponent(encodedStr: string) {
   const firstDecoded = decodeURIComponent(encodedStr);
   const buffer = Buffer.from(firstDecoded, "latin1");
   const fullyDecoded = buffer.toString("utf8");
   return fullyDecoded;
}
