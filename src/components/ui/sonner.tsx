"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "#131316",
          "--normal-text": "#F5F5F7",
          "--normal-border": "#232326",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
