import { FC, memo, Ref, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { TextArea, TextAreaRef } from "./TextArea";
import { Button } from "./Button";

export type SubmitTextAreaRef = {
  focus: () => void,
}

export const SubmitTextArea: FC<{
  ref?: Ref<SubmitTextAreaRef>,
  initialValue: string,
  onSubmit?: (value: string) => void,
  onBlur?: () => void,
  className?: string
}> = memo(({
  ref,
  initialValue = "",
  onBlur = () => { },
  onSubmit = () => { },
  className = ""
}) => {
  const textAreaRef = useRef<TextAreaRef>(null);

  const [text, setText] = useState<string>(initialValue);

  const [isChanged, setIsChanged] = useState(false);

  const [isEqual, setIsEqual] = useState(true);

  const canSubmit = useMemo(() => isChanged && !isEqual, [isChanged, isEqual]);

  const handleCancel = useCallback(() => {
    textAreaRef.current?.reset(initialValue);
  }, [initialValue])

  const handleChanged = useCallback((isChanged: boolean) => {
    setIsChanged(isChanged);
  }, [])

  const handleOnChange = useCallback((value: string) => {
    setIsEqual(value === initialValue);
    setText(value);
  }, [initialValue]);

  const handleSubmit = useCallback(() => {
    onSubmit(text);
  }, [text]);

  useImperativeHandle(ref, () => ({
    focus: () => {
      console.log("focus");
      textAreaRef.current?.focus();
    }
  }), []);

  return (
    <div className={`flex flex-col items-end gap-2`}>
      <TextArea
        className={className}
        ref={textAreaRef}
        initialValue={initialValue}
        onChanged={handleChanged}
        onChange={handleOnChange}
        onBlur={onBlur}
      />
      <div className="w-full flex justify-between">
        {
          canSubmit
            ? (
              <Button
                className="px-2 py-1 text-sm font-medium"
                onClick={handleCancel}
              >Cancel</Button>
            )
            : <div></div>
        }
        <Button
          className="px-2 py-1 text-sm font-medium"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >Submit</Button>
      </div>
    </div >
  )
});