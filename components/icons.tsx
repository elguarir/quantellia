import { ComponentProps } from "react";

type Props = ComponentProps<"svg">;

export const UserIcon = (props: Props) => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth={1.5}>
         <circle cx={12} cy={9} r={3}></circle>
         <circle cx={12} cy={12} r={10}></circle>
         <path
            strokeLinecap="round"
            d="M17.97 20c-.16-2.892-1.045-5-5.97-5s-5.81 2.108-5.97 5"
         ></path>
      </g>
   </svg>
);

export const SignoutButton = (props: Props) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
   >
      <path
         fill="currentColor"
         d="M14.945 1.25c-1.367 0-2.47 0-3.337.117c-.9.12-1.658.38-2.26.981c-.524.525-.79 1.17-.929 1.928c-.135.737-.161 1.638-.167 2.72a.75.75 0 0 0 1.5.008c.006-1.093.034-1.868.142-2.457c.105-.566.272-.895.515-1.138c.277-.277.666-.457 1.4-.556c.755-.101 1.756-.103 3.191-.103h1c1.436 0 2.437.002 3.192.103c.734.099 1.122.28 1.4.556c.276.277.456.665.555 1.4c.102.754.103 1.756.103 3.191v8c0 1.435-.001 2.436-.103 3.192c-.099.734-.279 1.122-.556 1.399c-.277.277-.665.457-1.399.556c-.755.101-1.756.103-3.192.103h-1c-1.435 0-2.436-.002-3.192-.103c-.733-.099-1.122-.28-1.399-.556c-.243-.244-.41-.572-.515-1.138c-.108-.589-.136-1.364-.142-2.457a.75.75 0 1 0-1.5.008c.006 1.082.032 1.983.167 2.72c.14.758.405 1.403.93 1.928c.601.602 1.36.86 2.26.982c.866.116 1.969.116 3.336.116h1.11c1.368 0 2.47 0 3.337-.116c.9-.122 1.658-.38 2.26-.982c.602-.602.86-1.36.982-2.26c.116-.867.116-1.97.116-3.337v-8.11c0-1.367 0-2.47-.116-3.337c-.121-.9-.38-1.658-.982-2.26c-.602-.602-1.36-.86-2.26-.981c-.867-.117-1.97-.117-3.337-.117z"
      ></path>
      <path
         fill="currentColor"
         d="M2.001 11.249a.75.75 0 0 0 0 1.5h11.973l-1.961 1.68a.75.75 0 1 0 .976 1.14l3.5-3a.75.75 0 0 0 0-1.14l-3.5-3a.75.75 0 0 0-.976 1.14l1.96 1.68z"
      ></path>
   </svg>
);

export const SettingsIcon = (props: Props) => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth={1.5}>
         <circle cx={12} cy={12} r={3}></circle>
         <path d="M13.765 2.152C13.398 2 12.932 2 12 2c-.932 0-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083c-.092.223-.129.484-.143.863a1.617 1.617 0 0 1-.79 1.353a1.617 1.617 0 0 1-1.567.008c-.336-.178-.579-.276-.82-.308a2 2 0 0 0-1.478.396C4.04 5.79 3.806 6.193 3.34 7c-.466.807-.7 1.21-.751 1.605a2 2 0 0 0 .396 1.479c.148.192.355.353.676.555c.473.297.777.803.777 1.361c0 .558-.304 1.064-.777 1.36c-.321.203-.529.364-.676.556a2 2 0 0 0-.396 1.479c.052.394.285.798.75 1.605c.467.807.7 1.21 1.015 1.453a2 2 0 0 0 1.479.396c.24-.032.483-.13.819-.308a1.617 1.617 0 0 1 1.567.008c.483.28.77.795.79 1.353c.014.38.05.64.143.863a2 2 0 0 0 1.083 1.083C10.602 22 11.068 22 12 22c.932 0 1.398 0 1.765-.152a2 2 0 0 0 1.083-1.083c.092-.223.129-.483.143-.863c.02-.558.307-1.074.79-1.353a1.617 1.617 0 0 1 1.567-.008c.336.178.579.276.819.308a2 2 0 0 0 1.479-.396c.315-.242.548-.646 1.014-1.453c.466-.807.7-1.21.751-1.605a2 2 0 0 0-.396-1.479c-.148-.192-.355-.353-.676-.555A1.617 1.617 0 0 1 19.562 12c0-.558.304-1.064.777-1.36c.321-.203.529-.364.676-.556a2 2 0 0 0 .396-1.479c-.052-.394-.285-.798-.75-1.605c-.467-.807-.7-1.21-1.015-1.453a2 2 0 0 0-1.479-.396c-.24.032-.483.13-.82.308a1.617 1.617 0 0 1-1.566-.008a1.617 1.617 0 0 1-.79-1.353c-.014-.38-.05-.64-.143-.863a2 2 0 0 0-1.083-1.083Z"></path>
      </g>
   </svg>
);

export const DocumentIcon = (props: Props) => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth={1.5}>
         <path d="M5 8c0-2.828 0-4.243.879-5.121C6.757 2 8.172 2 11 2h2c2.828 0 4.243 0 5.121.879C19 3.757 19 5.172 19 8v8c0 2.828 0 4.243-.879 5.121C17.243 22 15.828 22 13 22h-2c-2.828 0-4.243 0-5.121-.879C5 20.243 5 18.828 5 16zm0-3.924c-.975.096-1.631.313-2.121.803C2 5.757 2 7.172 2 10v4c0 2.828 0 4.243.879 5.121c.49.49 1.146.707 2.121.803M19 4.076c.975.096 1.631.313 2.121.803C22 5.757 22 7.172 22 10v4c0 2.828 0 4.243-.879 5.121c-.49.49-1.146.707-2.121.803"></path>
         <path strokeLinecap="round" d="M9 13h6M9 9h6m-6 8h3"></path>
      </g>
   </svg>
);

export const FolderIcon = (props: Props) => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
         fill="none"
         stroke="currentColor"
         strokeLinecap="round"
         strokeWidth={1.7}
         d="M18 10h-5m9 1.798c0-2.632 0-3.949-.77-4.804a2.984 2.984 0 0 0-.224-.225C20.151 6 18.834 6 16.202 6h-.374c-1.153 0-1.73 0-2.268-.153a4 4 0 0 1-.848-.352C12.224 5.224 11.816 4.815 11 4l-.55-.55c-.274-.274-.41-.41-.554-.53a4 4 0 0 0-2.18-.903C7.53 2 7.336 2 6.95 2c-.883 0-1.324 0-1.692.07A4 4 0 0 0 2.07 5.257C2 5.626 2 6.068 2 6.95M21.991 16c-.036 2.48-.22 3.885-1.163 4.828C19.657 22 17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172C2 19.657 2 17.771 2 14v-3"
      ></path>
   </svg>
);

export const NoteBookIcon = (props: Props) => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth={1.6}>
         <path d="M3 8c0-2.828 0-4.243.879-5.121C4.757 2 6.172 2 9 2h6c2.828 0 4.243 0 5.121.879C21 3.757 21 5.172 21 8v8c0 2.828 0 4.243-.879 5.121C19.243 22 17.828 22 15 22H9c-2.828 0-4.243 0-5.121-.879C3 20.243 3 18.828 3 16z"></path>
         <path
            strokeLinecap="round"
            d="M8 2.5V22M2 12h2m-2 4h2M2 8h2m7.5-1.5h5m-5 3.5h5"
         ></path>
      </g>
   </svg>
);

export const HomeIcon = (props: Props) => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeWidth={1.7}>
         <path d="M2.364 12.958c-.38-2.637-.57-3.956-.029-5.083c.54-1.127 1.691-1.813 3.992-3.183l1.385-.825C9.8 2.622 10.846 2 12 2c1.154 0 2.199.622 4.288 1.867l1.385.825c2.3 1.37 3.451 2.056 3.992 3.183c.54 1.127.35 2.446-.03 5.083l-.278 1.937c-.487 3.388-.731 5.081-1.906 6.093C18.276 22 16.553 22 13.106 22h-2.212c-3.447 0-5.17 0-6.345-1.012c-1.175-1.012-1.419-2.705-1.906-6.093z"></path>
         <path strokeLinecap="round" d="M15 18H9"></path>
      </g>
   </svg>
);

export const YoutubeIcon = (props: Props) => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 180" {...props}>
      <path
         fill="#f00"
         d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134"
      ></path>
      <path
         fill="#fff"
         d="m102.421 128.06l66.328-38.418l-66.328-38.418z"
      ></path>
   </svg>
);

export const BrowserIcon = (props: Props) => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <rect
         width={416}
         height={384}
         x={48}
         y={64}
         fill="none"
         stroke="currentColor"
         strokeLinejoin="round"
         strokeWidth={32}
         rx={48}
         ry={48}
      ></rect>
      <path
         fill="currentColor"
         d="M397.82 64H114.18C77.69 64 48 94.15 48 131.2V176h16c0-16 16-32 32-32h320c16 0 32 16 32 32h16v-44.8c0-37.05-29.69-67.2-66.18-67.2"
      ></path>
   </svg>
);

export const PdfIcon = (props: Props) => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" {...props}>
      <path
         fill="currentColor"
         d="M854.6 288.7c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4zM790.2 326L602 137.8V326zM633.22 637.26c-15.18-.5-31.32.67-49.65 2.96c-24.3-14.99-40.66-35.58-52.28-65.83l1.07-4.38l1.24-5.18c4.3-18.13 6.61-31.36 7.3-44.7c.52-10.07-.04-19.36-1.83-27.97c-3.3-18.59-16.45-29.46-33.02-30.13c-15.45-.63-29.65 8-33.28 21.37c-5.91 21.62-2.45 50.07 10.08 98.59c-15.96 38.05-37.05 82.66-51.2 107.54c-18.89 9.74-33.6 18.6-45.96 28.42c-16.3 12.97-26.48 26.3-29.28 40.3c-1.36 6.49.69 14.97 5.36 21.92c5.3 7.88 13.28 13 22.85 13.74c24.15 1.87 53.83-23.03 86.6-79.26c3.29-1.1 6.77-2.26 11.02-3.7l11.9-4.02c7.53-2.54 12.99-4.36 18.39-6.11c23.4-7.62 41.1-12.43 57.2-15.17c27.98 14.98 60.32 24.8 82.1 24.8c17.98 0 30.13-9.32 34.52-23.99c3.85-12.88.8-27.82-7.48-36.08c-8.56-8.41-24.3-12.43-45.65-13.12M385.23 765.68v-.36l.13-.34a55 55 0 0 1 5.6-10.76c4.28-6.58 10.17-13.5 17.47-20.87c3.92-3.95 8-7.8 12.79-12.12c1.07-.96 7.91-7.05 9.19-8.25l11.17-10.4l-8.12 12.93c-12.32 19.64-23.46 33.78-33 43c-3.51 3.4-6.6 5.9-9.1 7.51a16.4 16.4 0 0 1-2.61 1.42c-.41.17-.77.27-1.13.3a2.2 2.2 0 0 1-1.12-.15a2.07 2.07 0 0 1-1.27-1.91M511.17 547.4l-2.26 4l-1.4-4.38c-3.1-9.83-5.38-24.64-6.01-38c-.72-15.2.49-24.32 5.29-24.32c6.74 0 9.83 10.8 10.07 27.05c.22 14.28-2.03 29.14-5.7 35.65zm-5.81 58.46l1.53-4.05l2.09 3.8c11.69 21.24 26.86 38.96 43.54 51.31l3.6 2.66l-4.39.9c-16.33 3.38-31.54 8.46-52.34 16.85c2.17-.88-21.62 8.86-27.64 11.17l-5.25 2.01l2.8-4.88c12.35-21.5 23.76-47.32 36.05-79.77zm157.62 76.26c-7.86 3.1-24.78.33-54.57-12.39l-7.56-3.22l8.2-.6c23.3-1.73 39.8-.45 49.42 3.07c4.1 1.5 6.83 3.39 8.04 5.55a4.64 4.64 0 0 1-1.36 6.31a6.7 6.7 0 0 1-2.17 1.28"
      ></path>
   </svg>
);

export const SparkIcon = (p: Props) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...p}
   >
      <path
         d="M15 2L15.5387 4.39157C15.9957 6.42015 17.5798 8.00431 19.6084 8.46127L22 9L19.6084 9.53873C17.5798 9.99569 15.9957 11.5798 15.5387 13.6084L15 16L14.4613 13.6084C14.0043 11.5798 12.4202 9.99569 10.3916 9.53873L8 9L10.3916 8.46127C12.4201 8.00431 14.0043 6.42015 14.4613 4.39158L15 2Z"
         stroke="currentColor"
         strokeWidth="1.5"
         strokeLinejoin="round"
      />
      <path
         d="M7 12L7.38481 13.7083C7.71121 15.1572 8.84275 16.2888 10.2917 16.6152L12 17L10.2917 17.3848C8.84275 17.7112 7.71121 18.8427 7.38481 20.2917L7 22L6.61519 20.2917C6.28879 18.8427 5.15725 17.7112 3.70827 17.3848L2 17L3.70827 16.6152C5.15725 16.2888 6.28879 15.1573 6.61519 13.7083L7 12Z"
         stroke="currentColor"
         strokeWidth="1.5"
         strokeLinejoin="round"
      />
   </svg>
);

export const TranscriptIcon = (p: Props) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...p}
   >
      <path
         d="M5.25 17C5.25 17.4142 5.58579 17.75 6 17.75C6.41421 17.75 6.75 17.4142 6.75 17H5.25ZM21.1213 2.87868L21.6517 2.34835V2.34835L21.1213 2.87868ZM16.2022 18.9846L16.9337 18.8191V18.8191L16.2022 18.9846ZM2.17264 18.9846L1.44113 19.1501L2.17264 18.9846ZM2.19447 17.3756L2.77981 17.8445L2.19447 17.3756ZM12 2.75H16V1.25H12V2.75ZM21.25 8V18H22.75V8H21.25ZM6.75 17V8H5.25V17H6.75ZM12 1.25C10.607 1.25 9.48678 1.24841 8.60825 1.36652C7.70814 1.48754 6.95027 1.74643 6.34835 2.34835L7.40901 3.40901C7.68577 3.13225 8.07435 2.9518 8.80812 2.85315C9.56347 2.75159 10.5646 2.75 12 2.75V1.25ZM6.75 8C6.75 6.56458 6.75159 5.56347 6.85315 4.80812C6.9518 4.07434 7.13225 3.68577 7.40901 3.40901L6.34835 2.34835C5.74643 2.95027 5.48754 3.70814 5.36652 4.60825C5.24841 5.48678 5.25 6.60699 5.25 8H6.75ZM16 2.75C17.4354 2.75 18.4365 2.75159 19.1919 2.85315C19.9257 2.9518 20.3142 3.13225 20.591 3.40901L21.6517 2.34835C21.0497 1.74643 20.2919 1.48754 19.3918 1.36652C18.5132 1.24841 17.393 1.25 16 1.25V2.75ZM22.75 8C22.75 6.60699 22.7516 5.48678 22.6335 4.60825C22.5125 3.70814 22.2536 2.95027 21.6517 2.34835L20.591 3.40901C20.8678 3.68577 21.0482 4.07434 21.1469 4.80812C21.2484 5.56347 21.25 6.56458 21.25 8H22.75ZM21.25 18C21.25 19.0355 21.0607 19.867 20.6999 20.417C20.3709 20.9185 19.8613 21.25 18.9937 21.25V22.75C20.3398 22.75 21.3334 22.186 21.9541 21.2398C22.543 20.3422 22.75 19.1736 22.75 18H21.25ZM18.9937 21.25C18.466 21.25 18.0603 21.0267 17.7233 20.618C17.3689 20.1881 17.1009 19.5582 16.9337 18.8191L15.4707 19.1501C15.6671 20.0185 16.0087 20.8963 16.566 21.5722C17.1408 22.2694 17.9489 22.75 18.9937 22.75V21.25ZM4.96411 21.25C4.43641 21.25 4.0307 21.0267 3.69378 20.618C3.33932 20.1881 3.07136 19.5582 2.90415 18.8191L1.44113 19.1501C1.63758 20.0185 1.97915 20.8963 2.53641 21.5722C3.1112 22.2694 3.91939 22.75 4.96411 22.75V21.25ZM4.96411 22.75H18.9937V21.25H4.96411V22.75ZM3.96199 17.75H13.9831V16.25H3.96199V17.75ZM2.90415 18.8191C2.80483 18.3801 2.75633 18.1518 2.7505 17.9862C2.7466 17.8755 2.7631 17.8654 2.77981 17.8445L1.60913 16.9067C1.32496 17.2614 1.23753 17.6446 1.25143 18.039C1.26339 18.3784 1.35442 18.7668 1.44113 19.1501L2.90415 18.8191ZM3.96199 16.25C3.49923 16.25 3.059 16.2476 2.70126 16.3071C2.3029 16.3734 1.91089 16.53 1.60913 16.9067L2.77981 17.8445C2.78888 17.8332 2.79271 17.8307 2.8012 17.8264C2.81587 17.8189 2.85623 17.802 2.94755 17.7868C3.15391 17.7524 3.447 17.75 3.96199 17.75V16.25ZM16.9337 18.8191C16.8204 18.3182 16.7246 17.8912 16.6188 17.5654C16.5168 17.2517 16.3636 16.8863 16.0455 16.6326L15.1101 17.8052C15.0665 17.7704 15.1088 17.7723 15.1921 18.0288C15.2716 18.2734 15.3507 18.6198 15.4707 19.1501L16.9337 18.8191ZM13.9831 17.75C14.4403 17.75 14.7226 17.751 14.9274 17.7731C15.1245 17.7943 15.136 17.8258 15.1101 17.8052L16.0455 16.6326C15.7453 16.3931 15.3995 16.3152 15.0879 16.2817C14.784 16.249 14.4062 16.25 13.9831 16.25V17.75Z"
         fill="currentColor"
      />
      <path
         opacity="0.4"
         d="M10.5 7H17.5"
         stroke="currentColor"
         strokeWidth="1.5"
         strokeLinecap="round"
      />
      <path
         opacity="0.4"
         d="M10.5 11H14"
         stroke="currentColor"
         strokeWidth="1.5"
         strokeLinecap="round"
      />
   </svg>
);

export const YTFilledIcon = (p: Props) => (
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...p}>
      <path
         fill="currentColor"
         d="m10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73"
      ></path>
   </svg>
);

export const CutePdfIcon = (p: Props) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      {...p}
   >
      <ellipse cx={50} cy="57.96" fill="#fb7369" rx="31.38" ry="2.73" />
      <path
         fill="#c9dcf4"
         d="m71.99,88.11c-14.66,1.19-29.31,1.19-43.97,0-3.67-.3-6.52-3.29-6.71-6.96-1.04-20.43-1.04-40.86,0-61.3.19-3.68,3.05-6.66,6.72-6.96,9.87-.8,19.74-1.06,29.62-.78,2.13.06,4.14.98,5.62,2.52,4.46,4.66,9.01,9.34,13.6,13.94,1.47,1.47,2.33,3.45,2.39,5.53.43,15.69.24,31.37-.55,47.06-.19,3.67-3.04,6.66-6.71,6.96Z"
      />
      <path
         fill="#4a254b"
         d="m50,53.5c2.57,0,4.68-1.94,4.97-4.43.03-.3-.19-.57-.49-.57-1.73,0-7.22,0-8.95,0-.3,0-.53.27-.49.57.28,2.49,2.4,4.43,4.97,4.43Z"
      />
      <circle cx="39.5" cy={42} r="5.5" fill="#fff" />
      <circle cx="39.5" cy={42} r="2.5" fill="#4a254b" />
      <circle cx="60.5" cy={42} r="5.5" fill="#fff" />
      <circle cx="60.5" cy={42} r="2.5" fill="#4a254b" />
      <path
         fill="#6b96d6"
         d="m68.63,31.42h10.08c-.41-1.06-1.03-2.04-1.85-2.87-4.58-4.6-9.13-9.28-13.6-13.94-.9-.94-2-1.64-3.21-2.07l.02,10.32c.01,4.72,3.84,8.54,8.56,8.54Z"
      />
      <path
         fill="#fb7369"
         d="m81.38,57.96c0,1.51-14.05,2.73-31.38,2.73s-31.38-1.22-31.38-2.73v20.98h.09c-.05.07-.09.13-.09.2,0,1.51,14.05,2.73,31.38,2.73s31.38-1.22,31.38-2.73c0-.07-.04-.13-.09-.2h.09v-20.98Z"
      />
      <g>
         <path
            fill="#4a254b"
            d="m36.17,77.18c-.47,0-.83-.13-1.09-.39-.26-.26-.38-.63-.38-1.1v-8.45c0-.48.13-.85.39-1.1.26-.26.63-.38,1.1-.38h3.94c1.28,0,2.27.33,2.97.98.7.66,1.05,1.56,1.05,2.71s-.35,2.06-1.05,2.71c-.7.66-1.69.98-2.97.98h-2.48v2.54c0,.47-.12.83-.37,1.1-.25.26-.61.39-1.1.39Zm1.47-6.29h1.97c.55,0,.98-.12,1.28-.36.3-.24.45-.6.45-1.08s-.15-.85-.45-1.09c-.3-.23-.73-.35-1.28-.35h-1.97v2.88Z"
         />
         <path
            fill="#4a254b"
            d="m47.05,77.04c-.5,0-.88-.13-1.14-.39-.26-.26-.39-.64-.39-1.13v-8.24c0-.49.13-.87.39-1.13.26-.26.64-.39,1.14-.39h3.14c1.96,0,3.48.49,4.55,1.47,1.07.98,1.61,2.37,1.61,4.16,0,.9-.14,1.69-.42,2.39s-.68,1.29-1.2,1.78c-.52.49-1.17.85-1.93,1.1s-1.63.38-2.62.38h-3.14Zm1.41-2.38h1.54c.57,0,1.05-.07,1.46-.21s.75-.34,1.02-.61.47-.6.61-1.01c.13-.41.2-.88.2-1.44,0-1.11-.27-1.93-.82-2.46-.54-.53-1.37-.79-2.48-.79h-1.54v6.51Z"
         />
         <path
            fill="#4a254b"
            d="m59.58,77.18c-.47,0-.83-.13-1.1-.39-.26-.26-.39-.64-.39-1.13v-8.38c0-.49.13-.87.39-1.13.26-.26.64-.39,1.14-.39h5.33c.38,0,.67.1.86.29.19.19.29.47.29.83s-.1.66-.29.86-.48.3-.86.3h-3.92v2.27h3.57c.37,0,.66.1.86.29.2.19.3.47.3.83s-.1.66-.3.85c-.2.19-.48.29-.86.29h-3.57v3.1c0,1.01-.49,1.52-1.46,1.52Z"
         />
      </g>
   </svg>
);
