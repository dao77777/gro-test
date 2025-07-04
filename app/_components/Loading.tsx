import { LoaderCircle } from "lucide-react";
import { FC } from "react";

export const Loading: FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <LoaderCircle className={`animate-spin ${className}`} />
  )
}