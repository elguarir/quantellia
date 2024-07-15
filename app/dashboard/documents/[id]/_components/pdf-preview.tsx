"use client";
import * as React from "react";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { themePlugin } from "@react-pdf-viewer/theme";

import type {
   ToolbarSlot,
   TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";
import { getBaseUrl } from "@/lib/utils";
import { useTheme } from "next-themes";

interface PdfPreviewProps {
   docId: string;
}

const PdfPreview = (p: PdfPreviewProps) => {
   const { resolvedTheme } = useTheme();
   const themePluginInstance = themePlugin();

   const toolbarPluginInstance = toolbarPlugin();
   const pageNavigationPluginInstance = pageNavigationPlugin();
   const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;
   const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
      ...slot,
      Download: () => <></>,
      SwitchTheme: () => <></>,
      Open: () => <></>,
   });

   return (
      <div>
         <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
            <div className={`h-[calc(100vh-16rem)] w-full flex-col`}>
               <div
                  className="align-center flex bg-[#eeeeee] p-1 text"
                  style={{
                     borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                  }}
               >
                  <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
               </div>
               <Viewer
                  fileUrl={`${getBaseUrl()}/api/v1/documents/pdf/${p.docId}`}
                  plugins={[
                     toolbarPluginInstance,
                     pageNavigationPluginInstance,
                     themePluginInstance,
                  ]}
                  theme={"auto"}
               />
            </div>
         </Worker>
      </div>
   );
};

export default PdfPreview;
