import { FC, memo, Ref, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { LeadMessageDisplay } from "./LeadMessageDisplay";
import { MarkdownEditor } from "../../Input/MarkdownEditor/MarkdownEditor";
import { useCompletion } from "@ai-sdk/react";

export type LeadMessageForGenerator = {
    idx: string,
    name: string,
    role: string,
    company: string,
    message: string,
    linkedinUrl: string,
    isGenerating: boolean,
    isGenerateError?: Error,
    isDraftMessageReady: boolean
}

export type LeadMessageGeneratorRef = {
    generateMessageByAI: () => void,
    stopGenerating: () => void,
}

export const LeadMessageGenerator: FC<{
    ref?: Ref<LeadMessageGeneratorRef>,
    leadMessage: LeadMessageForGenerator, onLeadMessageChange: (leadMessage: LeadMessageForGenerator) => void,
}> = memo(({
    ref,
    leadMessage, onLeadMessageChange
}) => {
    const leadMessageRef = useRef(leadMessage);
    leadMessageRef.current !== leadMessage && (leadMessageRef.current = leadMessage);

    const name = useMemo(() => leadMessage.name, [leadMessage.name]);

    const role = useMemo(() => leadMessage.role, [leadMessage.role]);

    const company = useMemo(() => leadMessage.company, [leadMessage.company]);

    const {
        completion, setCompletion, input, setInput,
        isLoading, error, data,
        complete, stop,
        handleInputChange, handleSubmit
    } = useCompletion({ api: "/api/generate-message" });

    useEffect(() => {
        setInput(`Write a short, friendly LinkedIn outreach message to ${leadMessage.name}, who is a ${leadMessage.role} at ${leadMessage.company}. Make it casual and under 500 characters.`)
    }, [name, role, company]);

    useEffect(() => {
        const newLeadMessage = {
            ...leadMessageRef.current,
            message: completion,
            isGenerating: isLoading,
            isGenerateError: error,
            isDraftMessageReady: completion.trim() !== "" && !isLoading && !error,
        };

        onLeadMessageChange(newLeadMessage);
    }, [isLoading, error, completion]);

    useImperativeHandle(ref, () => ({
        generateMessageByAI: handleSubmit,
        stopGenerating: stop
    }), [handleSubmit, stop]);

    return (
        <div className="flex items-start gap-2 p-2 bg-gray-200 rounded-xs">
            <LeadMessageDisplay
                className="w-1/3!"
                classNameForKey="text-gray-800 font-bold"
                classNameForValue="text-gray-600!"
                name={name}
                role={role}
                company={company}
            />
            {
                error
                    ? <div className='text-red-800'>Some error happened when generate message, please try again later.</div>
                    : (
                        <MarkdownEditor
                            className="w-2/3!"
                            classNameForEditor="bg-white!"
                            markdown={completion}
                            onMarkdownChange={setCompletion}
                        />
                    )
            }
        </div>
    );
});