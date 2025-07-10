import { FC, memo, Ref, useCallback, useImperativeHandle } from "react";
import { useSyncRef } from "@/app/_hooks/useSyncRef";
import { useNodesRef } from "@/app/_hooks/useNodesRef";
import { Item } from "./Item";
import { GenerateMessageByAIRef } from "../_hooks/useGenerateMessageByAI";
import { LeadMessage } from "../_types/LeadMessage";

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

    const handleOnItemChange = useCallback((id: string) => (item: LeadMessage) => {
        const newItems = itemsRef
            .current
            .map(i => i.id === id ? item : i);

        onListChange(newItems);
    }, []);

    return (
        list.map(i => (
            <Item
                key={i.id}
                ref={setNode(i.id)}
                value={i}
                onValueChange={handleOnItemChange(i.id)}
            />
        ))
    )
});

export type { IndexRef as MultiModeGeneratorRef };
export { Index as MultiModeGenerator };
