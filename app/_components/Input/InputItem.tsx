import { ChangeEvent, FC, memo, useMemo } from "react";

export const InputItem: FC<{
    label?: string,
    placeholder?: string,
    require?: boolean,
    value: string,
    onChange: (value: string) => void,
    className?: string,
    classNameForLabel?: string,
    classNameForInput?: string
}> = memo(({
    label = "Label",
    placeholder = "Placeholder",
    require = false,
    value,
    onChange,
    className = "",
    classNameForLabel = "",
    classNameForInput = ""
}) => {
    const labelText = useMemo(() => require ? label + " *" : label + " (Optional)", [label, require]);

    const handleInputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }

    return (
        <div
            className={`
            flex flex-col gap-2
            ${className}
            `}
        >
            <label
                className={`
                text-sm text-gray-800 font-medium
                ${classNameForLabel}
                `}
            >{labelText}</label>
            <input
                className={`
                rounded-xs border border-gray-200 p-2 
                text-gray-800 placeholder:text-gray-400 
                ${classNameForInput}
                `}
                type="text"
                value={value}
                onChange={handleInputOnChange}
                placeholder={placeholder}
            />
        </div>
    );
});