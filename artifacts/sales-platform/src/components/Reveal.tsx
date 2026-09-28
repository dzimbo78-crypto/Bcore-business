import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type Ref,
} from "react";
import { useMotionPreferences } from "./MotionPreferences";
import { observeReveal } from "@/lib/reveal-observer";

type RevealProps = HTMLAttributes<HTMLElement> & {
  delay?: number;
  variant?: "text" | "image";
};
function RevealElement({
  as: Tag,
  delay = 0,
  variant = "text",
  className = "",
  style,
  onFocusCapture,
  ...props
}: RevealProps & { as: "div" | "article" | "figure" }) {
  const ref = useRef<HTMLElement>(null);
  const { paused } = useMotionPreferences();
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    // A visible block never hides again, including when pausing/resuming.
    if (paused) {
      node.dataset.reveal = "visible";
      return;
    }
    if (node.dataset.reveal === "visible") return;
    if (node.getBoundingClientRect().top < window.innerHeight - 24) {
      node.dataset.reveal = "visible";
      return;
    }
    node.dataset.reveal = "waiting";
    return observeReveal(node);
  }, [paused]);
  return (
    <Tag
      {...props}
      ref={ref as Ref<HTMLDivElement>}
      className={`reveal-block reveal-${variant} ${className}`}
      style={
        {
          ...style,
          "--reveal-delay": `${Math.min(Math.max(delay, 0), 0.14)}s`,
        } as CSSProperties
      }
      onFocusCapture={(event) => {
        if (ref.current) ref.current.dataset.reveal = "visible";
        onFocusCapture?.(event);
      }}
    />
  );
}
export function Reveal(props: RevealProps) {
  return <RevealElement as="div" {...props} />;
}
export function RevealArticle(props: RevealProps) {
  return <RevealElement as="article" {...props} />;
}
export function RevealFigure(props: RevealProps) {
  return <RevealElement as="figure" {...props} />;
}
