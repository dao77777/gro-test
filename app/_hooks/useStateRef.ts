import { useState } from "react"
import { useSyncRef } from "./useSyncRef";

export const useStateRef = <T>(initialState: T) => {
    const [val, setVal] = useState<T>(initialState);

    const valRef = useSyncRef<T>(val);

    return [val, valRef, setVal] as const;
}