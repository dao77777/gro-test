import { FC, memo, useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import { SubmitTextArea } from "./SubmitTextArea";

export const MarkdownEditor: FC<{
  markdown: string,
  onSubmit?: (markdown: string) => void
  className?: string
}> = memo(({
  markdown,
  onSubmit = () => { },
  className = ""
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const switchMode = useCallback(() => setIsEditMode(c => !c), []);

  const handleSwitchMode = useCallback(() => {
    switchMode();
  }, [switchMode])

  const handleSubmit = useCallback((message: string) => {
    onSubmit(message);
    switchMode();
  }, [onSubmit, switchMode])

  return (
    markdown === ""
      ? null
      : (
        <div className="relative">
          {
            isEditMode
              ? (
                <SubmitTextArea
                  initialValue={markdown}
                  onSubmit={handleSubmit}
                />
              )
              : (
                <div
                  className="rounded-xs p-2 bg-gray-50 prose max-w-none"
                ><ReactMarkdown>
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

