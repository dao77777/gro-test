import { useEffect, useState } from "react";
import { markdownToHtml } from "../_lib/remark";

export const uesMarkdown2HTML = (markdown: string) => {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    const exec = async () => {
      const html = await markdownToHtml(markdown);

      setHtml(html);
    };

    exec();
  }, [markdown]);

  return html;
}