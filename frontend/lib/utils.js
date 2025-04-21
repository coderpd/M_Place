import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function toast({ title, description }) {
  const { toast } = useToast();
  toast({
    title,
    description,
  });
}