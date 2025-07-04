import { FC, memo, ReactNode } from "react";
import { Loading } from "./Loading";

export const Button: FC<{
  children: ReactNode,
  className?: string,
  onClick?: () => void,
  loading?: boolean,
  disabled?: boolean
}> = memo(({
  children,
  className = "",
  onClick = () => { },
  disabled = false,
  loading = false
}) => {
  return (
    <button
      onClick={disabled ? () => { } : onClick}
      className={`
        shadow-sm hover:shadow-lg
        rounded-xs p-2
        ${disabled ? "bg-gray-400" : "bg-gray-800 hover:bg-gray-700"} text-white font-bold ${disabled ? "" : "active:scale-95"}
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        transition-all
        ${className}
        `}
      disabled={disabled}
    ><div className='w-full flex items-center justify-center gap-2'>
        {children}
        {loading ? <Loading /> : null}
      </div></button>
  )
});