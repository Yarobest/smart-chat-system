import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"article">) {
  return <article className={cn("aw-card", className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.ComponentProps<"header">) {
  return <header className={cn("aw-card-header", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("aw-card-title", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("aw-card-content", className)} {...props} />;
}
