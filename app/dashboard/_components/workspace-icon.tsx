import { tv, type VariantProps } from "tailwind-variants";

const worksapceIcon = tv({
   base: "relative block size-3 before:absolute before:inset-0 before:m-auto before:size-2 before:rounded-full",
   variants: {
      intent: {
         primary: "before:bg-primary-600",
         secondary: "before:bg-secondary-600",
         accent: "before:bg-accent-600",
         gray: "before:bg-gray-600",
         danger: "before:bg-danger-600",
         success: "before:bg-success-600",
         warning: "before:bg-warning-600",
         info: "before:bg-info-600",
         neutral: "before:bg-gray-950 dark:before:bg-white",
      },
   },
   defaultVariants: {
      intent: "primary",
   },
});

type WorkspaceIconProps = VariantProps<typeof worksapceIcon>;

export const WorkspaceIcon: React.FC<WorkspaceIconProps> = ({
   intent = "primary",
}) => {
   return <span className={worksapceIcon({ intent })} />;
};
