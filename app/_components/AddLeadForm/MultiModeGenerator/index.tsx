import { FC, memo, Ref, useCallback, useImperativeHandle, useMemo } from "react";
import { useSyncRef } from "@/app/_hooks/useSyncRef";
import { useNodesRef } from "@/app/_hooks/useNodesRef";
import { Item } from "./Item";
import { GenerateMessageByAIRef } from "../_hooks/useGenerateMessageByAI";
import { LeadMessage } from "../_types/LeadMessage";
import { AnimatePresence, motion } from "framer-motion";

type IndexRef = {
    generateMessageByAI: () => void,
    stopGenerating: () => void,
}

const Index: FC<{
    ref?: Ref<GenerateMessageByAIRef>,
    list?: LeadMessage[], onListChange?: (leadMessages: LeadMessage[]) => void,
}> = memo(({
    ref,
    list = [], onListChange = () => { }
}) => {
    const isGenerating = useMemo(() => list.some(i => i.isGenerating), [list]);

    const {
        nodesRef,
        setNode,
    } = useNodesRef<GenerateMessageByAIRef, LeadMessage>(list, (i: LeadMessage) => i.id);

    const itemsRef = useSyncRef(list);

    useImperativeHandle(ref, () => ({
        generateMessageByAI: () => {
            nodesRef.current.forEach(nodes => {
                nodes.node?.generateMessageByAI();
            });
        },
        stopGenerating: () => {
            nodesRef.current.forEach(nodes => {
                nodes.node?.stopGenerating();
            });
        }
    }), []);

    const layoutId = useCallback((id: string) => isGenerating ? undefined : id, [isGenerating]);

    const handleOnItemChange = useCallback((id: string) => (item: LeadMessage) => {
        onListChange(itemsRef
            .current
            .map(i => i.id === id ? item : i));
    }, []);

    const handleOnDelete = useCallback((id: string) => () => {
        onListChange(itemsRef
            .current
            .filter(i => i.id !== id));
    }, []);

    return (
        <AnimatePresence mode="popLayout">
            {list.map(i => (
                <motion.div
                    key={i.id}
                    layoutId={layoutId(i.id)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.24 }}
                >
                    <Item
                        ref={setNode(i.id)}
                        value={i}
                        onValueChange={handleOnItemChange(i.id)}
                        onDelete={handleOnDelete(i.id)}
                    />
                </motion.div>
            ))}
        </AnimatePresence>
    )
});

export type { IndexRef as MultiModeGeneratorRef };
export { Index as MultiModeGenerator };
