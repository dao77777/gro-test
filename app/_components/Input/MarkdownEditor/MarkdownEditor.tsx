import { FC, memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { SubmitTextArea } from "./SubmitTextArea";
import { AnimatePresence, motion } from "framer-motion";

const animation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.24 }
};

export const MarkdownEditor: FC<{
    markdown: string, onMarkdownChange?: (markdown: string) => void
    isWaiting?: boolean,
    isGenerating?: boolean,
    className?: string
    classNameForMarkdown?: string
    classNameForEditor?: string
}> = memo(({
    markdown, onMarkdownChange = () => { },
    isWaiting = false,
    isGenerating = false,
    className = "",
    classNameForMarkdown = "",
    classNameForEditor = ""
}) => {
    const isEmpty = useMemo(() => markdown.trim() === "", [markdown]);

    const [isEditMode, setIsEditMode] = useState(false);

    const handleSwitchMode = useCallback(() => setIsEditMode(c => !c), []);

    return (
        <div
            className={`
            relative
            ${className}`}
        ><AnimatePresence mode="wait">
                {
                    isEditMode
                        ? (
                            <motion.div key="edit-mode" {...animation}>
                                <SubmitTextArea
                                    value={markdown}
                                    onValueChange={onMarkdownChange}
                                    className={`
                                    rounded-xs border border-gray-100 focus:border-gray-400 p-2
                                    ${classNameForEditor}
                                    `}
                                />
                            </motion.div>

                        )
                        : (
                            <motion.div
                                className={`
                                rounded-xs p-2 min-h-10 max-w-none 
                                flex flex-col items-start gap-4
                                bg-gray-50
                                ${classNameForMarkdown}
                                `}
                                key="markdown-mode"
                                {...animation}
                            >
                                <AnimatePresence mode="wait">
                                    {isWaiting && <Label key="waiting">Waiting Content ...</Label>}
                                    {isGenerating && <Label key="generatin">Generating ...</Label>}
                                    {!isEmpty && !isWaiting && !isGenerating && <Label key="message">Message</Label>}
                                </AnimatePresence>
                                <AnimatePresence mode="wait">
                                    {
                                        isEmpty
                                            ? (
                                                <motion.p
                                                    className="self-center text-gray-200 text-xl py-4"
                                                    key="empty"
                                                    {...animation}
                                                >No Content</motion.p>
                                            )
                                            : (
                                                <motion.div
                                                    className="prose"
                                                    key="markdown"
                                                    {...animation}
                                                >
                                                    <ReactMarkdown>
                                                        {markdown}
                                                    </ReactMarkdown>
                                                </motion.div>
                                            )
                                    }
                                </AnimatePresence>
                            </motion.div>
                        )
                }
            </AnimatePresence>
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
        </div >
    );
});

const Label: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <motion.div
            className="
            rounded-full px-4 h-7
            flex items-center justify-center
            text-xs text-gray-400 bg-gray-200 pointer-events-none select-none
            "
            {...animation}
        >{children}</motion.div>
    )
}
