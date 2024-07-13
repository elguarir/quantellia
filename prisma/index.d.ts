export {};
declare global {
   namespace PrismaJson {
      // you can use classes, interfaces, types, etc.
      type XataFile = {
         name: string;
         size: number;
         version: number;
         mediaType: string;
         uploadKey: string;
         storageKey: string;
         enablePublicUrl: boolean;
         signedUrlTimeout: number;
         uploadUrlTimeout: number;
      };
   }
}
