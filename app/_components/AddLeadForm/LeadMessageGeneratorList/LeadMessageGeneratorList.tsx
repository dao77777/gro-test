import { FC, memo, Ref, useCallback, useImperativeHandle } from "react";
import { LeadMessageForGenerator, LeadMessageGenerator, LeadMessageGeneratorRef } from "./LeadMessageGenerator";
import { useSyncRef } from "@/app/_hooks/useSyncRef";
import { useNodesRef } from "@/app/_hooks/useNodesRef";

export type LeadMessageGeneratorListRef = {
    generateMessageByAI: () => void,
    stopGenerating: () => void,
}

export const LeadMessageGeneratorList: FC<{
    ref?: Ref<LeadMessageGeneratorListRef>,
    leadMessages?: LeadMessageForGenerator[], onLeadMessagesChange?: (leadMessages: LeadMessageForGenerator[]) => void,
}> = memo(({
    ref,
    leadMessages = [], onLeadMessagesChange = () => { }
}) => {
    const {
        nodesRef,
        setNode,
    } = useNodesRef<LeadMessageGeneratorRef, LeadMessageForGenerator>(leadMessages, (i: LeadMessageForGenerator) => i.idx);

    const leadMessagesRef = useSyncRef(leadMessages);

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

    const handleOnLeadMessageChange = useCallback((idx: string) => (leadMessage: LeadMessageForGenerator) => {
        const updatedMessages = leadMessagesRef.current.map(item => item.idx === idx ? leadMessage : item);

        onLeadMessagesChange(updatedMessages);
    }, []);

    return (
        leadMessages.map(i => (
            <LeadMessageGenerator
                key={i.idx}
                ref={setNode(i.idx)}
                leadMessage={i}
                onLeadMessageChange={handleOnLeadMessageChange(i.idx)}
            />
        ))
    )
});