import { wordDiff } from "../lib/diff";

type Props = {
  before: string;
  after: string;
  variant?: "inline" | "expanded";
};

export function DiffRenderer({ before, after, variant = "inline" }: Props) {
  const ops = wordDiff(before, after);

  return (
    <span
      className={
        variant === "expanded"
          ? "block font-body text-[1.02rem] leading-[1.7] text-[var(--ink)]"
          : "font-body leading-[1.65] text-[var(--ink)]"
      }
    >
      {ops.map((op, i) => {
        if (op.kind === "equal") return <span key={i}>{op.text}</span>;
        if (op.kind === "delete") {
          if (/^\s+$/.test(op.text)) return null;
          return <Deletion key={i} text={op.text} />;
        }
        if (/^\s+$/.test(op.text)) return <span key={i}>{op.text}</span>;
        return <Insertion key={i} text={op.text} />;
      })}
    </span>
  );
}

function Deletion({ text }: { text: string }) {
  return (
    <span className="relative mx-[1px] text-[var(--ink-soft)]">
      <span className="line-through decoration-[var(--red)] decoration-[1.5px]">
        {text}
      </span>
    </span>
  );
}

function Insertion({ text }: { text: string }) {
  return (
    <span className="relative inline-block mx-[1px]">
      <span className="italic text-[var(--red)]">{text}</span>
      <span
        aria-hidden
        className="absolute left-0 right-0 -bottom-[0.45em] text-center text-[0.75em] leading-none text-[var(--red)] select-none"
      >
        ‸
      </span>
    </span>
  );
}
