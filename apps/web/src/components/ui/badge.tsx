import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.ComponentProps<"span"> & {
  tone?: "gold" | "red" | "blue" | "green" | "orange";
};

export function Badge({ className, tone = "gold", ...props }: BadgeProps) {
  return <span className={cn("aw-badge", tone, className)} {...props} />;
}
