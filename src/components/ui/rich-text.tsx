import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Renders plain text / lightweight markdown (headings, paragraphs, lists)
 * without pulling in a markdown dependency.
 */
export function RichText({ content, className }: { content: string; className?: string }) {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n{2,}/);

  return (
    <div className={cn("space-y-5 text-base leading-relaxed text-body", className)}>
      {blocks.map((block, index) => renderBlock(block.trim(), index))}
    </div>
  );
}

function renderBlock(block: string, key: number): ReactNode {
  if (!block) return null;

  const heading = /^(#{1,3})\s+(.*)$/.exec(block);
  if (heading) {
    const level = heading[1].length;
    const text = heading[2];
    if (level === 1) return <h2 key={key} className="text-2xl font-semibold text-heading">{text}</h2>;
    if (level === 2) return <h2 key={key} className="text-2xl font-semibold text-heading">{text}</h2>;
    return <h3 key={key} className="text-xl font-semibold text-heading">{text}</h3>;
  }

  const lines = block.split("\n");
  const isList = lines.every((line) => /^\s*[-*]\s+/.test(line));
  if (isList) {
    return (
      <ul key={key} className="list-disc space-y-1.5 pl-6">
        {lines.map((line, i) => (
          <li key={i}>{renderInline(line.replace(/^\s*[-*]\s+/, ""))}</li>
        ))}
      </ul>
    );
  }

  const isOrdered = lines.every((line) => /^\s*\d+[.)]\s+/.test(line));
  if (isOrdered) {
    return (
      <ol key={key} className="list-decimal space-y-1.5 pl-6">
        {lines.map((line, i) => (
          <li key={i}>{renderInline(line.replace(/^\s*\d+[.)]\s+/, ""))}</li>
        ))}
      </ol>
    );
  }

  if (block.startsWith("> ")) {
    return (
      <blockquote key={key} className="border-l-2 border-accent pl-4 italic text-heading">
        {renderInline(block.replace(/^>\s?/gm, ""))}
      </blockquote>
    );
  }

  return <p key={key}>{renderInline(block)}</p>;
}

function renderInline(text: string): ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-heading">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-heading">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
