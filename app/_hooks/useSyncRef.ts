import { useRef } from "react";

export const useSyncRef = <T>(val: T) => {
    const ref = useRef(val);

    ref.current !== val && (ref.current = val);

    return ref
}