import { FC } from "react"

export const LeadMessageDisplay: FC<{
  name: string,
  role: string,
  company: string,
  className?: string
  classNameForKey?: string,
  classNameForValue?: string
}> = ({
  name,
  role,
  company,
  className = "",
  classNameForKey = "",
  classNameForValue = ""
}) => {
    const keyStyle = `w-16 font-bold text-gray-300 ${classNameForKey}`;

    const valueStyle = `text-gray-800 ${classNameForValue}`;

    return (
      <div
        className={`
        w-full
        flex flex-col items-start justify-between text-xs
        ${className}
        `}
      >
        <div className="flex gap-2">
          <span className={keyStyle}>Name</span>
          <span className={valueStyle}>{name}</span>
        </div>
        <div className="flex gap-2">
          <span className={keyStyle}>Role</span>
          <span className={valueStyle}>{role}</span>
        </div>
        <div className="flex gap-2">
          <span className={keyStyle}>Name</span>
          <span className={valueStyle}>{company}</span>
        </div>
      </div>
    )
  }