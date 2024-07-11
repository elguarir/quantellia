"use client";
import { useState, useCallback, useEffect } from "react";
import { uploadFile } from "@/lib/utils";

// Define the error codes
export enum ErrorCode {
   FileInvalidType = "file-invalid-type",
   FileTooLarge = "file-too-large",
   FileTooSmall = "file-too-small",
   TooManyFiles = "too-many-files",
   UploadError = "upload-error",
}

// Define the file status types
type IdleFileItem = {
   status: "idle";
};

type UploadingFileItem = {
   status: "uploading";
   progress: number;
};

type DoneFileItem = {
   status: "done";
};

type ErrorFileItem = {
   status: "error";
   error: {
      code: ErrorCode;
      message: string;
   };
};

// Define the FileItem type
export type FileItem = { id: string; file: File; preview?: string } & (
   | IdleFileItem
   | UploadingFileItem
   | DoneFileItem
   | ErrorFileItem
);

type UploadOptions = {
   autoUpload?: boolean;
};

type UseUploadReturnType<T extends "single" | "multiple"> = T extends "single"
   ? {
        file: FileItem | undefined;
        startUpload: (uploadUrl: string) => void;
        isUploading: boolean;
        clear: () => void;
        onChange: (file: File) => void;
     }
   : {
        files: FileItem[];
        isUploading: boolean;
        startUpload: (uploadUrl: string) => void;
        clear: () => void;
        onChange: (files: File[]) => void;
     };

const useUpload = <T extends "single" | "multiple">(
   type: T,
   options: UploadOptions = { autoUpload: true },
): UseUploadReturnType<T> => {
   const [files, setFiles] = useState<FileItem[]>([]);
   const [isUploading, setIsUploading] = useState<boolean>(false);
   const [previews, setPreviews] = useState<string[]>([]);

   const uploadFiles = useCallback(
      (fileItems: FileItem[], uploadUrl?: string) => {
         console.log("Uploading files", fileItems);
         setIsUploading(true);
         if (!uploadUrl) {
            console.log("No upload url");
            return;
         }
         Promise.all(
            fileItems.map((fileItem) => {
               if (fileItem.status === "idle") {
                  setFiles((prev) =>
                     prev.map((f) =>
                        f.id === fileItem.id
                           ? { ...f, status: "uploading", progress: 0 }
                           : f,
                     ),
                  );
                  return uploadFile({
                     url: uploadUrl,
                     file: fileItem.file,
                     onProgress: (progress) => {
                        setFiles((prev) =>
                           prev.map((f) =>
                              f.id === fileItem.id
                                 ? { ...f, status: "uploading", progress }
                                 : f,
                           ),
                        );
                     },
                     onError: (error) => {
                        setFiles((prev) =>
                           prev.map((f) =>
                              f.id === fileItem.id
                                 ? {
                                      ...f,
                                      status: "error",
                                      error: {
                                         code: ErrorCode.UploadError,
                                         message: error.message,
                                      },
                                   }
                                 : f,
                           ),
                        );
                     },
                  }).then((res) => {
                     if (res?.success) {
                        setFiles((prev) =>
                           prev.map((f) =>
                              f.id === fileItem.id
                                 ? { ...f, status: "done" }
                                 : f,
                           ),
                        );
                     }
                  });
               }
               return Promise.resolve();
            }),
         ).finally(() => {
            setIsUploading(false);
         });
      },
      [setIsUploading, setFiles, uploadFile],
   );

   const onChange = useCallback(
      (inputFiles: File | File[]) => {
         const newFileItems = Array.isArray(inputFiles)
            ? inputFiles
            : [inputFiles];

         const updatedFileItems = newFileItems.map((file) => {
            let preview = URL.createObjectURL(file);
            setPreviews((prev) => [...prev, preview]);
            return {
               id: crypto.getRandomValues(new Uint32Array(1))[0].toString(),
               file,
               status: "idle",
               preview: file.type.startsWith("image/") ? preview : undefined,
            };
         }) as FileItem[];

         setFiles((prevFiles) => {
            if (type === "single") {
               return updatedFileItems; // Replace the current file with the new one
            } else {
               return [
                  ...prevFiles,
                  ...(updatedFileItems.map((item) => ({
                     ...item,
                     error: null,
                  })) as FileItem[]),
               ];
            }
         });

         if (options.autoUpload) {
            uploadFiles(updatedFileItems);
         }
      },
      [type, options.autoUpload, uploadFiles],
   );

   const startUpload = useCallback(
      (uploadUrl: string) => {
         let filesToUpload = files.filter((f) => f.status === "idle");
         if (filesToUpload.length > 0) {
            uploadFiles(filesToUpload, uploadUrl);
         }
      },
      [files, uploadFiles],
   );

   const clear = () => {
      setFiles([]);
   };

   useEffect(() => {
      return () => {
         previews.forEach((preview) => URL.revokeObjectURL(preview));
      };
   }, [previews]);

   useEffect(() => {
      let filesToUpload = files.filter((f) => f.status === "idle");
      if (options.autoUpload && filesToUpload.length > 0) {
         uploadFiles(filesToUpload);
      }
   }, [files, options.autoUpload, uploadFiles]);

   if (type === "single") {
      return {
         file: files[0],
         isUploading,
         onChange,
         startUpload,
         clear,
      } as UseUploadReturnType<T>;
   } else {
      return {
         files,
         isUploading,
         onChange,
         startUpload,
         clear,
      } as UseUploadReturnType<T>;
   }
};

export default useUpload;
