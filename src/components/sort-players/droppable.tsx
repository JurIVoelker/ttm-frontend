import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";

export function Droppable({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div ref={setNodeRef} className={cn("min-h-10 min-w-20", className)}>
      {children}
    </div>
  );
}
