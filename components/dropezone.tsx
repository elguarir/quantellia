import { useCallback } from "react";
import {
   useDropzone as useDropzoneBase,
   DropzoneOptions as BaseDropzoneOptions,
   DropzoneState,
   FileRejection,
} from "react-dropzone";

export type DropzoneOptions = {
   multiple?: BaseDropzoneOptions["multiple"];
   accept?: BaseDropzoneOptions["accept"];
   minSize?: BaseDropzoneOptions["minSize"];
   maxSize?: BaseDropzoneOptions["maxSize"];
   noClick?: BaseDropzoneOptions["noClick"];
   noDrag?: BaseDropzoneOptions["noDrag"];
   autoFocus?: BaseDropzoneOptions["autoFocus"];
   disabled?: BaseDropzoneOptions["disabled"];
};

export interface DropzoneProps {
   onSelect?: (files: File[]) => void;
   onError?: BaseDropzoneOptions["onError"];
   options: DropzoneOptions;
   children: (state: {
      open: () => void;
      getRootProps: DropzoneState["getRootProps"];
      getInputProps: DropzoneState["getInputProps"];
      isDragAccept: DropzoneState["isDragAccept"];
      isDragActive: DropzoneState["isDragActive"];
      isDragReject: DropzoneState["isDragReject"];
   }) => React.JSX.Element;
}

export const Dropzone: React.FC<DropzoneProps> = ({
   onSelect,
   onError,
   options,
   children,
}) => {
   const onDropAccepted = useCallback(
      (acceptedFiles: File[]) => {
         onSelect?.(acceptedFiles);
      },
      [onSelect],
   );

   const onDropRejected = useCallback(
      (rejectedFiles: FileRejection[]) => {
         onError?.(new Error(rejectedFiles[0].errors[0].message));
      },
      [onError],
   );

   const {
      open,
      getRootProps,
      getInputProps,
      isDragAccept,
      isDragActive,
      isDragReject,
   } = useDropzoneBase({
      ...options,
      onDropAccepted,
      onDropRejected,
   });

   return children({
      open,
      getRootProps,
      getInputProps,
      isDragAccept,
      isDragActive,
      isDragReject,
   });
};
