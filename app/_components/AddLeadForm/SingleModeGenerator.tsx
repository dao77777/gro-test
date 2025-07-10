import { FC, memo, Ref } from "react";
import { MarkdownEditor } from "../Input/MarkdownEditor/MarkdownEditor";
import { GenerateMessageByAIRef, useGenerateMessageByAI } from "./_hooks/useGenerateMessageByAI";
import { LeadMessage } from "./_types/LeadMessage";

export const SingleModeGnerator: FC<{
    ref?: Ref<GenerateMessageByAIRef>,
    value: LeadMessage,
    onValueChange: (value: LeadMessage) => void,
}> = memo(({
    ref,
    value,
    onValueChange,
}) => {
    const {
        isWaiting,
        isGenerating,
        handleOnMessageChange
    } = useGenerateMessageByAI({
        ref,
        value,
        onValueChange,
    });

    return (
        <MarkdownEditor
            isWaiting={isWaiting}
            isGenerating={isGenerating}
            markdown={value.message}
            onMarkdownChange={handleOnMessageChange}
        />
    );
});

export type { GenerateMessageByAIRef as SingleModeGeneratorRef };
