import { Document } from "@prisma/client";
import {
   CheckCircledIcon,
   CircleIcon,
   ClockIcon,
   CrossCircledIcon,
} from "@radix-ui/react-icons";

export const getStatus = (status: Document["status"]) => {
   switch (status) {
      case "FAILED":
         return {
            label: "Failed",
            icon: CrossCircledIcon,
            intent: "danger",
         };
      case "IN_PROGRESS":
         return {
            label: "In Progress",
            icon: ClockIcon,
            intent: "warning",
         };
      case "PENDING":
         return {
            label: "Pending",
            icon: CircleIcon,
            intent: "gray",
         };
      case "PROCESSED":
         return {
            label: "Processed",
            icon: CheckCircledIcon,
            intent: "success",
         };
   }
};

export enum Types {
   YoutubeVideo = "videos",
   File = "files",
   WebPage = "web_pages",
}