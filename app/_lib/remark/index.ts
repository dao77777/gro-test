import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse) // 解析 Markdown
    .use(remarkHtml) // 转换为 HTML
    .process(markdown);

  return result.toString();
}