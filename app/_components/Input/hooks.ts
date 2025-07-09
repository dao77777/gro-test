import { useCallback, useMemo, useState } from "react";

const useSyncMode = ({
  value = "",
  onChange = (value: string) => { }
}: {
  value?: string,
  onChange?: (value: string) => void,
}) => {
  const changeValue = useCallback((value: string) => {
    onChange(value);
  }, [onChange]);

  return {
    value,
    changeValue
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

  const [isValueChanged, setIsValueChanged] = useState(false);

  const reset = useCallback((value: string) => {
    setValue(value);
    setIsValueChanged(false);
    onChanged(false);
    onChange(value);
  }, [onChanged, onChange]);

  const changeValue = useCallback((value: string) => {
    if (!isValueChanged) {
      setIsValueChanged(true);
      onChanged(true);
    }

    setValue(value);
    onChange(value);
  }, [isValueChanged, onChanged, onChange]);

  return {
    value,
    reset,
    changeValue
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
    value: syncModeValue,
    changeValue: changeSyncModeValue
  } = useSyncMode({
    value,
    onChange
  });

  const {
    value: initialModeValue,
    changeValue: changeinitialModeValue,
    reset: handleInitialValueReset
  } = useInitialMode({
    initialValue,
    onChanged,
    onChange
  });

  const isSyncMode = useMemo(() => value !== undefined, [value]);

  const valueR = useMemo(() => isSyncMode ? syncModeValue : initialModeValue, [isSyncMode, syncModeValue, initialModeValue]);;

  const changeValue = useMemo(() => isSyncMode ? changeSyncModeValue : changeinitialModeValue, [isSyncMode, changeSyncModeValue, changeinitialModeValue]);

  const reset = useMemo(() => isSyncMode ? () => { } : handleInitialValueReset, [isSyncMode, handleInitialValueReset]);

  return {
    value: valueR,
    changeValue,
    reset
  }
}