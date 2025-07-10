import { useCompletion } from "@ai-sdk/react";
import { Ref, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { useSyncRef } from "@/app/_hooks/useSyncRef";
import { GENERATE_MESSAGE_API_PATH } from "@/app/constant";
import { LeadMessage } from "../_types/LeadMessage";

export type GenerateMessageByAIRef = {
    generateMessageByAI: () => void;
    stopGenerating: () => void;
}

export const useGenerateMessageByAI = ({
    ref,
    value,
    onValueChange
}: {
    ref?: Ref<GenerateMessageByAIRef>,
    value: LeadMessage,
    onValueChange: (value: LeadMessage) => void
}) => {
    const valueRef = useSyncRef(value);

    const {
        completion, setCompletion,
        input, setInput,
        isLoading, error,
        handleSubmit, stop
    } = useCompletion({ api: GENERATE_MESSAGE_API_PATH })

    const stopRef = useSyncRef(stop);

    const isGenerating = useMemo(() => isLoading && completion !== "", [completion, isLoading]);

    const isWaiting = useMemo(() => isLoading && completion === "", [completion, isLoading]);

    useImperativeHandle(ref, () => ({
        generateMessageByAI: handleSubmit,
        stopGenerating: stop
    }), [handleSubmit, stop]);

    useEffect(() => {
        onValueChange({
            ...valueRef.current,
            message: completion,
            isGenerating: isLoading,
            isGenerateError: error,
            isDraftMessageReady: completion.trim() !== "" && !isLoading && !error,
        })
    }, [completion, isLoading, error]);

    useEffect(() => {
        setInput(`Write a short, friendly LinkedIn outreach message to ${value.name}, who is a ${value.role} at ${value.company}. Make it casual and under 500 characters.`);
    }, [value.name, value.role, value.company]);

    const handleOnMessageChange = useCallback((message: string) => {
        setCompletion(message);

        onValueChange({
            ...valueRef.current,
            message,
        });
    }, []);

    useEffect(() => {
        return () => {
            stopRef.current();
        }
    }, []);

    return {
        isGenerating,
        isWaiting,
        handleOnMessageChange
    }
}
