import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TextArea, TextAreaRef } from "../TextArea";
import { Button } from "../../Button";

export const SubmitTextArea: FC<{
    value?: string, onValueChange?: (value: string) => void
    className?: string, classNameForCancelButton?: string, classNameForSubmitButton?: string,
}> = ({
    value = "", onValueChange = () => { },
    className = "", classNameForCancelButton = "", classNameForSubmitButton = ""
}) => {
        const textAreaRef = useRef<TextAreaRef>(null);

        const [valueRT, setValueRT] = useState<string>(value);

        const [isValueRTChanged, setIsValueRTChanged] = useState(false);

        useEffect(() => {
            setValueRT(value);
        }, [value]);

        const handleOnValueRTChange = useCallback((value: string) => {
            if (!isValueRTChanged) {
                setIsValueRTChanged(true);
            }

            setValueRT(value);
        }, [isValueRTChanged]);

        const handleCancel = useCallback(() => {
            setValueRT(value);

            setIsValueRTChanged(false);

            textAreaRef.current?.blur();
        }, [value]);

        const handleSubmit = useCallback(() => {
            onValueChange(valueRT);

            setIsValueRTChanged(false);

            textAreaRef.current?.blur();
        }, [valueRT]);

        const canSubmit = useMemo(() => isValueRTChanged && valueRT !== value, [value, valueRT, isValueRTChanged]);

        return (
            <div className={`flex flex-col items-end gap-2`}>
                <TextArea
                    className={className}
                    ref={textAreaRef}
                    value={valueRT} onValueChange={handleOnValueRTChange}
                />
                <div
                    className="
                    w-full 
                    flex justify-between"
                >
                    {
                        canSubmit
                            ? (
                                <Button
                                    className={`
                                    px-2 py-1 
                                    text-sm font-medium 
                                    ${classNameForCancelButton}
                                    `}
                                    onClick={handleCancel}
                                >Cancel</Button>
                            )
                            : <div></div>
                    }
                    <Button
                        className={`
                        px-2 py-1 
                        text-sm font-medium 
                        ${classNameForSubmitButton}
                        `}
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                    >Submit</Button>
                </div>
            </div >
        )
    }

