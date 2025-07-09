import { useEffect, useRef } from "react";

type RefType<T> = { idx: string, node: T | undefined }

export const useNodesRef = <T, J>(list: J[], getIdx: (item: J) => string) => {
    const nodesRef = useRef<RefType<T>[]>([]);

    useEffect(() => {
        const filter = nodesRef.current.filter(i => list.some(j => getIdx(j) === i.idx));

        const add = list.filter(i => !nodesRef.current.some(j => getIdx(i) === j.idx));

        nodesRef.current = [...filter, ...add.map(i => ({ idx: getIdx(i), node: undefined }))];
    }, [list]);

    const setNode = (idx: string) => (node: T | null) => {
        if (node) {
            nodesRef.current = nodesRef.current.map(i => {
                if (i.idx === idx) {
                    return { idx: idx, node: node };
                }

                return i;
            });
        }
    };

    return {
        nodesRef,
        setNode,
    };
};
