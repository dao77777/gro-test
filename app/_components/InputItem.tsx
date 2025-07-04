import { FC, memo, useMemo } from "react";

export const InputItem: FC<{
  label?: string,
  placeholder?: string,
  require?: boolean,
  value: string,
  onChange: (value: string) => void
}> = memo(({ label = "Label", placeholder = "Placeholder", require = false, value, onChange }) => {
  const labelR = useMemo(() => require ? label + " *" : label + " (Optional)", [label, require]);

  return (
    <div className='flex flex-col gap-2'>
      <p className='text-sm text-gray-600 font-bold'>{labelR}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xs border border-gray-200 p-2 text-gray-800 placeholder:text-gray-400"
      />
    </div>
  )
});