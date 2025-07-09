import { FC, useCallback, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, Ref, memo, ChangeEvent } from "react";

const useHeightSync = (text: string, rows?: number) => {
  const nodeRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (rows !== undefined) return;

    const node = nodeRef.current;

    if (node) {
      node.style.height = 'auto';
      const scrollHeight = node.scrollHeight;
      const style = window.getComputedStyle(node);
      const borderTop = parseFloat(style.borderTopWidth || "0");
      const borderBottom = parseFloat(style.borderBottomWidth || "0");
      node.style.height = `${scrollHeight + borderTop + borderBottom}px`;
    }
  }, [text]);

  return nodeRef;
};

export type TextAreaRef = {
  focus: () => void, blur: () => void
};

export const TextArea: FC<{
  ref?: Ref<TextAreaRef>,
  value?: string, onValueChange?: (value: string) => void,
  onFocus?: () => void, onBlur?: () => void,
  rows?: number,
  className?: string
}> = memo(({
  ref,
  value = "", onValueChange = () => { },
  rows,
  onFocus = () => { },
  onBlur = () => { },
  className = "",
}) => {
  const textAreaRef = useHeightSync(value, rows);

  useImperativeHandle(ref, () => ({
    focus: () => {
      const textArea = textAreaRef.current;

      if (textArea) {
        textArea.focus();
      }
    },
    blur: () => {
      const textArea = textAreaRef.current;

      if (textArea) {
        textArea.blur();
      }
    },
  }), []);

  const handleTextAreaOnChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange(e.target.value);
  }, [onValueChange]);

  return (
    <textarea
      className={`
      w-full 
      resize-none outline-0 
      ${className}
      `}
      ref={textAreaRef}
      value={value}
      onChange={handleTextAreaOnChange}
      rows={rows}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
});