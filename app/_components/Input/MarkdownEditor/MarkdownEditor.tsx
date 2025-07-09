import { FC, memo, useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { SubmitTextArea } from "./SubmitTextArea";
import { useCompletion } from "@ai-sdk/react";

export const MarkdownEditor: FC<{
    markdown: string, onMarkdownChange?: (markdown: string) => void
    className?: string
    classNameForMarkdown?: string
    classNameForEditor?: string
}> = memo(({
    markdown, onMarkdownChange = () => { },
    className = "",
    classNameForMarkdown = "",
    classNameForEditor = ""
}) => {
    const [isEditMode, setIsEditMode] = useState(false);

    const handleSwitchMode = useCallback(() => setIsEditMode(c => !c), []);

    return (
        markdown === ""
            ? null
            : (
                <div className={`relative ${className}`}>
                    {
                        isEditMode
                            ? (
                                <SubmitTextArea
                                    value={markdown}
                                    onValueChange={onMarkdownChange}
                                    className={`
                                    rounded-xs border border-gray-100 focus:border-gray-400 p-2
                                    ${classNameForEditor}
                                    `}
                                />
                            )
                            : (
                                <div className={`rounded-xs p-2 bg-gray-50 prose max-w-none ${classNameForMarkdown}`}><ReactMarkdown>
                                    {markdown}
                                </ReactMarkdown></div>
                            )
                    }
                    <div
                        className={`
                        absolute right-2 top-2
                        rounded-full px-4 py-1 w-12 h-7
                        flex items-center justify-center
                        font-medium text-sm text-gray-800 ${isEditMode ? "border hover:border-gray-400 bg-white" : "bg-gray-200! hover:bg-gray-300!"} 
                        cursor-pointer select-none
                        transition-all
                        `}
                        onClick={handleSwitchMode}
                    >{isEditMode ? "Exit" : "Edit"}</div>
                </div>
            )
    );
});

