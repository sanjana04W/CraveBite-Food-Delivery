import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login | SterlingLaw",
  description: "Secure client login page",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
