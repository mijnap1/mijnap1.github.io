import type { DetailedHTMLProps, HTMLAttributes } from "react";

// Ionicons is loaded as a web component from unpkg in the root layout.
type IonIconProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  name?: string;
  src?: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ion-icon": IonIconProps;
    }
  }
}
