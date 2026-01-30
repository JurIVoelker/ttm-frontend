import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Book01Icon,
  BookOpen01Icon,
  Copy01Icon,
  Copy02Icon,
  GlassesIcon,
  Search02Icon,
  StarIcon,
} from "hugeicons-react";
import { PlusSquareIcon, ShareIcon } from "lucide-react";
import Title from "../title";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";

const IosInstallationGuide = ({ ...props }) => {
  return (
    <div {...props}>
      <Title>Benachrichtigungen aktivieren</Title>
      <p className="mt-8">
        Um Benachrichtigungen zu aktivieren, musst du zuerst die Webseite als
        App installieren.
      </p>
      <StepTitle>1. Teilen anklicken</StepTitle>
      <p className="mb-2">
        Zuerst unten im Browser das Teilen-Symbol in der Mitte anklicken:
      </p>
      <div className="w-full bg-secondary/70 flex items-center justify-between p-4 text-apple-blue/30 rounded-sm">
        <ArrowLeft01Icon strokeWidth={2} />
        <ArrowRight01Icon strokeWidth={2} />
        <ShareIcon className="animate-pulse text-apple-blue" />
        <BookOpen01Icon strokeWidth={2} />
        <Copy01Icon strokeWidth={2} />
      </div>
      <StepTitle>2. Zum Home-Bildschirm hinzufügen</StepTitle>
      <p>In der Liste die Option &quot;Zum Home-Bildschirm&quot; auswählen.</p>
      <div className="mt-4">
        <OptionFiller
          className="rounded-md mb-2"
          fillerText="Kopieren"
          icon={<Copy02Icon className="size-5" />}
        />
        <OptionFiller
          className="rounded-t-md"
          fillerText="Zur Leseliste hinzufügen"
          icon={<GlassesIcon className="size-5" />}
        />
        <Separator />
        <OptionFiller fillerText="Lesezeichen" />
        <Separator />
        <OptionFiller
          icon={<StarIcon className="size-5" />}
          fillerText="Als Favoriten sichern"
        />
        <Separator />
        <OptionFiller
          icon={<Search02Icon className="size-5" />}
          fillerText="Auf der Seite suchen"
        />
        <Separator />
        <OptionFiller
          className="rounded-b-md"
          icon={<PlusSquareIcon className="size-5" />}
          content="Zum Home-Bildschirm"
        />
      </div>
      <StepTitle>3. Als App installieren</StepTitle>
      <p>
        Anschließend die Option &quot;Als Web-App öffnen&quot;
        <span className="ml-0.5 -translate-y-0.5 size-4 bg-primary text-primary-foreground rounded-full inline-flex items-center justify-center text-xs">
          1
        </span>{" "}
        auswählen und dann &quot;Hinzufügen&quot;
        <span className="ml-0.5 -translate-y-0.5 size-4 bg-primary text-primary-foreground rounded-full inline-flex items-center justify-center text-xs">
          2
        </span>{" "}
        wählen.
      </p>
      <div>
        <div className="flex justify-between bg-secondary/70 py-2 px-2 mt-4 rounded-t-sm text-sm relative">
          <div className="text-apple-blue text-sm">Abbrechen</div>
          <div className="text-apple-blue text-sm">Hinzufügen</div>
          <div className="absolute -right-3 -top-2 size-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center animate-pulse">
            2
          </div>
        </div>
        <Separator />
        <div className="p-2 flex items-center overflow-hidden">
          <Image
            src={"/icons/ttm-lg.png"}
            alt="Tischtennis-Manager Icon"
            width={100}
            height={100}
            className="size-14 rounded-xl"
          />
          <div>
            <p className="text-sm ml-2">Tischtennis Manager</p>
            <Separator className="ml-2 my-1" />
            <p className="text-muted-foreground text-sm text-nowrap text-ellipsis ml-2 grow">
              https://tt-manager.ttc-klingenmuenster.de
            </p>
          </div>
        </div>
        <Separator />
        <div className="bg-secondary/70 py-6 pb-12 rounded-b-sm">
          <Separator />
          <div className="text-sm bg-background p-2 relative flex justify-between items-center">
            <p>Als Web-App öffnen</p>
            <div className="rounded-full w-9 bg-apple-blue h-5 p-0.5">
              <div className="bg-background size-4 rounded-full ml-auto" />
            </div>
            <div className="absolute -right-3 -top-2 size-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center animate-pulse">
              1
            </div>
          </div>
          <Separator />
        </div>
      </div>
      <StepTitle>4. App öffnen</StepTitle>
      <p>
        Warte einen Moment, bis die App installiert ist. Öffne die App auf dem
        Home-Bildschirm und öffne in der App <strong>diese</strong> Seite
        (Benachrichtigungsseite).
      </p>
    </div>
  );
};

const OptionFiller = ({
  className,
  icon,
  content,
  fillerText = "Nicht auswählen",
}: {
  className?: string;
  content?: string;
  fillerText?: string;
  icon?: React.ReactElement;
}) => {
  return (
    <div
      className={cn(
        `bg-secondary/60 p-2 ${className} flex justify-between items-center`,
        content && "bg-secondary",
      )}
    >
      <p
        className={cn(
          !content && "blur-2xs select-none",
          "text-sm",
          content && "animate-pulse",
        )}
      >
        {content || fillerText}
      </p>
      <p
        className={cn(
          !content && "blur-2xs select-none",
          "text-muted-foreground",
          content && "animate-pulse",
        )}
      >
        {icon || <Book01Icon className="size-5" />}
      </p>
    </div>
  );
};

const StepTitle = ({ children }: { children: React.ReactNode }) => {
  return <h3 className="text-lg font-semibold mb-2 mt-8">{children}</h3>;
};

export default IosInstallationGuide;
