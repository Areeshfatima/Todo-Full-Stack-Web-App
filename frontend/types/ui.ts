import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated";
}

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline";
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export interface DialogProps
  extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface DropdownMenuProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface IconProps extends React.SVGProps<SVGElement> {
  icon: React.ComponentType<React.SVGProps<SVGElement>>;
  className?: string;
}

export interface PropsWithChildren<T> {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export const cn = (...inputs: any[]) => {
  return inputs
    .filter(Boolean)
    .map(input => {
      if (typeof input === "string") return input;
      if (Array.isArray(input)) return input.join(" ");
      if (typeof input === "object") {
        return Object.entries(input)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(" ");
      }
      return "";
    })
    .filter(Boolean)
    .join(" ");
};