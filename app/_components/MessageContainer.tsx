import { FC, memo, useEffect, useState } from "react";
import { markdownToHtml } from "../_lib/remark";

export const MessageContainer: FC<{ className?: string, generateMessage: string }> = memo(({ className = "", generateMessage }) => {
  const [htmlMessage, setHTMLMessage] = useState<string>("");

  useEffect(() => {
    const exec = async () => {
      const html = await markdownToHtml(generateMessage);

      setHTMLMessage(html);
    };

    exec();
  }, [generateMessage])


  return (
    generateMessage === ""
      ? null
      : (
        <div
          className={`rounded-xs p-2 bg-gray-100 ${className}`}
          dangerouslySetInnerHTML={{ __html: htmlMessage || "" }}
        />
      )
  );
});