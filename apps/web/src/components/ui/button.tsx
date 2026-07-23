import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "default" | "ghost" | "outline" | "tile";
  size?: "default" | "icon" | "sm";
};

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn("aw-button", `aw-button-${variant}`, `aw-button-${size}`, className)}
      {...props}
    />
  );
}
