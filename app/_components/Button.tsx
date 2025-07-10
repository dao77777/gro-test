import { FC, memo, ReactNode } from "react";
import { Loading } from "./Loading";

export const Button: FC<{
  children: ReactNode,
  onClick?: () => void,
  loading?: boolean,
  disabled?: boolean,
  className?: string,
  classNameForDisabled?: string,
  classNameForContent?: string,
}> = memo(({
  children,
  onClick = () => { },
  disabled = false,
  loading = false,
  className = "",
  classNameForDisabled = "",
  classNameForContent
}) => {
  return (
    <button
      onClick={disabled ? () => { } : onClick}
      className={`
        shadow-sm ${disabled ? "" : "hover:shadow-lg"}
        rounded-xs p-2
        ${disabled ? "bg-gray-400" : "bg-gray-800 hover:bg-gray-700"} text-white font-medium ${disabled ? "" : `active:scale-95`}
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        ${disabled ? classNameForDisabled : ""}
        transition-all
        ${className}
        `}
      disabled={disabled}
    ><div className='w-full flex items-center justify-center gap-2'>
        <div className={classNameForContent}>{children}</div>
        {loading ? <Loading /> : null}
      </div></button>
  );
});