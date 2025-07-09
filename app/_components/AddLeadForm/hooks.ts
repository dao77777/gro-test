import { useCompletion, UseCompletionOptions } from "@ai-sdk/react";
import { useEffect, useMemo, useState } from "react";

export const useLeadMessage = () => {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [company, setCompany] = useState("");
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const {
        completion: message,
        setInput: syncPrompt,
        handleSubmit: generateMessageByAI,
        isLoading: isGenerating,
        error: isGenerateError,
        setCompletion: setMessage
    } = useCompletion({ api: "/api/generate-message" })

    const isGenerateReady = useMemo(() => name.trim() !== "" && role.trim() !== "" && company.trim() !== "", [name, role, company]);

    const isDraftMessageReady = useMemo(() => message.trim() !== "" && isGenerateReady && !isGenerating && !isGenerateError, [message, isGenerateReady, isGenerating, isGenerateError])

    useEffect(() => {
        syncPrompt(`Write a short, friendly LinkedIn outreach message to ${name}, who is a ${role} at ${company}. Make it casual and under 500 characters.`)
    }, [name, role, company]);

    return {
        name, setName,
        role, setRole,
        company, setCompany,
        linkedinUrl, setLinkedinUrl,
        message, setMessage,
        generateMessageByAI,
        isGenerating,
        isGenerateError,
        isGenerateReady,
        isDraftMessageReady
    };
};

export const useControledCompletion = ({
    completion,
    onCompletionChange,
    completionOption
}: {
    completion: string,
    onCompletionChange: (message: string) => void,
    completionOption: UseCompletionOptions & {
        experimental_throttle?: number;
    }
}) => {
    const {
        completion: completionI, setCompletion: setCompletionI, input, setInput,
        isLoading, error, data,
        complete, stop,
        handleInputChange, handleSubmit
    } = useCompletion(completionOption);

    useEffect(() => {
        setCompletionI(completion);
    }, [completion]);

    useEffect(() => {
        if (completionI !== completion) {
            onCompletionChange(completionI);
        }
    }, [completionI, completion, onCompletionChange]);

    return {
        input, setInput,
        isLoading, error, data,
        complete, stop,
        handleInputChange, handleSubmit
    }
}