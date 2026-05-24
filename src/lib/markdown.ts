import { marked } from "marked";

marked.setOptions({ breaks: true, gfm: true });

/** Render Markdown to an HTML string for trusted (NVO/admin) content. */
export function renderMarkdown(md: string): string {
  return String(marked.parse(md ?? "", { async: false }));
}
