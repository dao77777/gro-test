import { FC, useCallback, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, Ref, memo } from "react";

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

const useSyncMode = ({
  value = "",
  onChange = (value: string) => { }
}: {
  value?: string,
  onChange?: (value: string) => void,
}) => {
  const handleChange = useCallback((value: string) => {
    onChange(value);
  }, [onChange]);

  return {
    value,
    handleChange
  }
}

const useInitialMode = ({
  initialValue = "",
  onChanged = () => { },
  onChange = () => { },
}: {
  initialValue?: string,
  onChanged?: (isChanged: boolean) => void,
  onChange?: (value: string) => void,
}) => {
  const [value, setValue] = useState(initialValue);

  const [isChanged, setIsChanged] = useState(false);

  const handleReset = useCallback((value: string) => {
    setValue(value);
    setIsChanged(false);
    onChanged(false);
    onChange(value);
  }, [onChanged, onChange]);

  const handleChange = useCallback((value: string) => {
    if (!isChanged) {
      setIsChanged(true);
      onChanged(true);
    }

    setValue(value);
    onChange(value);
  }, [isChanged, onChanged, onChange]);

  return {
    value,
    handleReset,
    handleChange
  };
}

const useSyncOrInitialMode = ({
  value,
  initialValue,
  onChanged = () => { },
  onChange = () => { },
}: {
  value?: string,
  initialValue?: string,
  onChanged?: (isChanged: boolean) => void,
  onChange?: (value: string) => void,
}) => {
  const {
    value: syncValue,
    handleChange: handleSyncValueChange
  } = useSyncMode({
    value,
    onChange
  });

  const {
    value: initialModeValue,
    handleChange: handleInitialValueChange,
    handleReset: handleInitialValueReset
  } = useInitialMode({
    initialValue,
    onChanged,
    onChange
  });

  const isSyncMode = useMemo(() => value !== undefined, [value]);

  const rValue = useMemo(() => isSyncMode ? syncValue : initialModeValue, [isSyncMode, syncValue, initialModeValue]);;

  const rHandleChange = useMemo(() => isSyncMode ? handleSyncValueChange : handleInitialValueChange, [isSyncMode, handleSyncValueChange, handleInitialValueChange]);

  const rHandleReset = useMemo(() => isSyncMode ? () => { } : handleInitialValueReset, [isSyncMode, handleInitialValueReset]);

  return {
    value: rValue,
    handleChange: rHandleChange,
    handleReset: rHandleReset
  }
}

export type TextAreaRef = {
  reset: (value: string) => void,
  focus: () => void
}

export const TextArea: FC<{
  ref?: Ref<TextAreaRef>,
  initialValue?: string,
  value?: string,
  onChanged?: (isChanged: boolean) => void,
  onChange?: (value: string) => void,
  onFocus?: () => void,
  onBlur?: () => void,
  rows?: number
  className?: string
}> = memo(({
  ref,
  initialValue,
  value,
  onChanged = () => { },
  onChange = () => { },
  onFocus = () => { },
  onBlur = () => { },
  rows,
  className = "",
}) => {
  const {
    value: rValue,
    handleChange,
    handleReset
  } = useSyncOrInitialMode({
    value,
    initialValue,
    onChanged,
    onChange
  })

  const nodeRef = useHeightSync(rValue, rows);

  useImperativeHandle(ref, () => ({
    reset: handleReset,
    focus: () => {
      const node = nodeRef.current;

      if (node) {
        node.focus();
      }
    }
  }), []);

  return (
    <textarea
      className={`w-full resize-none outline-0 ${className}`}
      ref={nodeRef}
      value={rValue}
      onChange={e => {
        handleChange(e.target.value)
      }}
      rows={rows}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )
});