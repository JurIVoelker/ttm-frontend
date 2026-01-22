import { useRouter } from "next/router";
import { Button } from "./ui/button";
import { ArrowLeft01Icon } from "hugeicons-react";
import { SaveIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const NavigationButtons = ({
  onSave,
  isSaving,
  className,
}: {
  onSave: () => void;
  isSaving: boolean;
  className?: string;
}) => {
  return (
    <>
      <div
        className={cn(
          "sticky top-22 flex items-center gap-2 z-10 py-4 pb-6 px-6 w-screen -translate-x-6 linear-background-bottom pointer-events-none md:hidden",
          className,
        )}
      >
        <Buttons onSave={onSave} isSaving={isSaving} />
      </div>
      <div className="fixed bottom-4 right-6 items-center gap-2 hidden md:flex p-2 bg-background rounded-md border blurred-shadow">
        <Buttons onSave={onSave} isSaving={isSaving} />
      </div>
    </>
  );
};

const Buttons = ({
  onSave,
  isSaving,
}: {
  onSave: () => void;
  isSaving: boolean;
}) => {
  const { back } = useRouter();

  return (
    <>
      <Button
        variant="outline"
        onClick={() => back()}
        className="pointer-events-auto"
        type="button"
      >
        <ArrowLeft01Icon strokeWidth={2} />
        Zurück
      </Button>
      <Button
        className="grow pointer-events-auto"
        onClick={onSave}
        disabled={isSaving}
        type="submit"
      >
        <SaveIcon />
        Speichern
      </Button>
    </>
  );
};

export default NavigationButtons;
