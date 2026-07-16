import { cn } from "@/lib/utils";

/**
 * A small woven band of diamonds — the "dok" motif found across Northern
 * Thai hill-tribe cloth — used as a quiet section divider. Indigo diamonds
 * with a single madder-red one at the center, echoing the site's palette:
 * indigo ground, red signature.
 */
export default function WeaveDivider({
  className,
  onIndigo = false,
}: {
  className?: string;
  /** Set when the divider sits on a dark indigo band. */
  onIndigo?: boolean;
}) {
  const side = onIndigo ? "bg-indigo-foreground/40" : "bg-indigo/30";
  const center = "bg-primary";
  return (
    <div
      aria-hidden="true"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-1.5 rotate-45",
            i === 3 ? center : side,
            (i === 0 || i === 6) && "h-1 w-1 opacity-60"
          )}
        />
      ))}
    </div>
  );
}
