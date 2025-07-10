import { FC, memo, Ref } from "react";
import { MarkdownEditor } from "../../Input/MarkdownEditor/MarkdownEditor";
import { GenerateMessageByAIRef, useGenerateMessageByAI } from "../_hooks/useGenerateMessageByAI";
import { LeadMessage } from "../_types/LeadMessage";
import { Button } from "../../Button";

export const Item: FC<{
    ref?: Ref<GenerateMessageByAIRef>,
    value?: LeadMessage,
    onValueChange?: (value: LeadMessage) => void,
    onDelete?: () => void
}> = memo(({
    ref,
    value = {
        id: "",
        name: "",
        role: "",
        company: "",
        linkedinUrl: "",
        message: "",
        isGenerating: false,
        isGenerateError: undefined,
        isDraftMessageReady: false
    },
    onValueChange = () => { },
    onDelete = () => { }
}) => {
    const {
        isWaiting,
        isGenerating,
        handleOnMessageChange
    } = useGenerateMessageByAI({
        ref,
        value,
        onValueChange
    });

    return (
        <div className="rounded-xs p-2 flex flex-col gap-2 bg-gray-200">
            <Button
                className="shadow-none! bg-gray-400! hover:bg-gray-500! active:scale-100! text-sm p-1!"
                onClick={onDelete}
            >Delete</Button>
            <div className="w-full flex items-start gap-2">
                <DisplayCard
                    className="w-3/10!"
                    name={value.name}
                    role={value.role}
                    company={value.company}
                />
                {
                    value.isGenerateError
                        ? <div className='text-red-800'>Some error happened when generate message, please try again later.</div>
                        : (
                            <MarkdownEditor
                                className="w-7/10!"
                                classNameForEditor="bg-white!"
                                isWaiting={isWaiting}
                                isGenerating={isGenerating}
                                markdown={value.message}
                                onMarkdownChange={handleOnMessageChange}
                            />
                        )
                }
            </div>

        </div>
    );
});

const DisplayCard: FC<{
    name: string,
    role: string,
    company: string,
    className?: string
    classNameForKey?: string,
    classNameForValue?: string
}> = ({
    name,
    role,
    company,
    className = "",
    classNameForKey = "",
    classNameForValue = ""
}) => {
        const kvPairStyle = "flex gap-2 items-center";

        const keyStyle = `w-16 text-sm font-medium text-gray-400 ${classNameForKey}`;

        const valueStyle = `text-gray-400 ${classNameForValue}`;

        return (
            <div
                className={`
                w-full
                flex flex-col items-start justify-between text-xs
                ${className}
                `}
            >
                <div className={kvPairStyle}>
                    <span className={keyStyle}>Name</span>
                    <span className={valueStyle}>{name}</span>
                </div>
                <div className={kvPairStyle}>
                    <span className={keyStyle}>Role</span>
                    <span className={valueStyle}>{role}</span>
                </div>
                <div className={kvPairStyle}>
                    <span className={keyStyle}>Name</span>
                    <span className={valueStyle}>{company}</span>
                </div>
            </div>
        )
    }