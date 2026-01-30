import {
  Book01Icon,
  Delete02Icon,
  Home07Icon,
  IncognitoIcon,
  PlusSignSquareIcon,
  Search02Icon,
  Share02Icon,
  TranslateIcon,
} from "hugeicons-react";
import {
  HistoryIcon,
  MonitorDown,
  MonitorIcon,
  MoreVertical,
  PlusIcon,
} from "lucide-react";
import Title from "../title";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";

const AndroidInstallationGuide = ({ ...props }) => {
  return (
    <div {...props}>
      <Title>Webseite als App installieren</Title>
      <p className="mt-8">
        Um Benachrichtigungen zu aktivieren, musst du zuerst die Webseite als
        App installieren.
      </p>
      <StepTitle>Menü öffnen</StepTitle>
      <p className="mb-2">
        Öffne das Menü in deiner Adressleiste über die drei Punkte{" "}
        <MoreVertical className="size-5 inline" />.
      </p>
      <div className="w-full bg-secondary/40 flex items-center justify-between p-2 text-primary/25 rounded-sm gap-2.5">
        <Home07Icon strokeWidth={2} className="shrink-0 size-5" />
        <div className="grow bg-primary/5 rounded-full text-sm text-nowrap text-ellipsis overflow-hidden px-3 items-center py-1.75">
          https://tt-manager.ttc-klingenmuenster.de
        </div>
        <PlusIcon className="shrink-0 size-5" />
        <span className="size-4.5 shrink-0 border-primary/30 border-2 rounded-sm text-xs inline-flex items-center justify-center font-bold">
          10
        </span>
        <MoreVertical className="shrink-0 size-5 text-primary animate-pulse glow" />
      </div>
      <StepTitle>2. Zum Startbildschirm hinzufügen</StepTitle>
      <p>
        In der Liste die Option &quot;Zum Startbildschirm hinzufügen&quot;
        auswählen.
      </p>
      <div className="mt-4">
        <OptionFiller
          className="rounded-t-md"
          fillerText="Neuer Tab"
          icon={<PlusSignSquareIcon className="size-5" />}
        />
        <OptionFiller
          className="rounded-t-md"
          fillerText="Neuer Ikognito-Tab"
          icon={<IncognitoIcon className="size-5" />}
        />
        <Separator className="max-w-[70%] ml-auto" />
        <OptionFiller
          fillerText="Verlauf"
          icon={<HistoryIcon className="size-5" />}
        />
        <OptionFiller
          icon={<Delete02Icon className="size-5" />}
          fillerText="Browserdaten löschen"
        />
        <Separator className="max-w-[70%] ml-auto" />
        <OptionFiller
          icon={<Share02Icon className="size-5" />}
          fillerText="Teilen"
        />
        <OptionFiller
          icon={<Search02Icon className="size-5" />}
          fillerText="Auf der Seite suchen"
        />
        <OptionFiller
          icon={<TranslateIcon className="size-5" />}
          fillerText="Übersetzen"
        />
        <OptionFiller
          icon={<MonitorDown className="size-5" />}
          content="Zum Startbildschirm hinzufügen"
        />
        <OptionFiller
          className="rounded-b-md"
          icon={<MonitorIcon className="size-5" />}
          fillerText="Desktopwebseite"
        />
      </div>
      <StepTitle>3. App installieren</StepTitle>
      <p>
        Bestätige die Installation der App über den Button
        &quot;Installieren&quot;.
      </p>
      <div>
        <div className="rounded-xl p-6 bg-secondary/70 mt-4">
          <h3 className="text-lg">App installieren</h3>
          <div className="flex gap-3 mt-6">
            <Image
              src={"/icons/ttm-lg.png"}
              alt="Tischtennis-Manager Icon"
              width={100}
              height={100}
              className="size-10"
            />
            <div className="">
              <p>Tischtennis Manager</p>
              <p className="text-muted-foreground text-sm">
                tt-manager.ttc-klingenmuenster.de
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-6 mt-8 text-sm text-primary">
            <span>Abbrechen</span>
            <span className="glow font-semibold animate-pulse">
              Installieren
            </span>
          </div>
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
        `bg-secondary/60 p-2 ${className} flex justify-start items-center gap-2 w-[70%] ml-auto overflow-hidden`,
        content && "bg-secondary",
      )}
    >
      <p
        className={cn(
          !content && "blur-2xs select-none",
          "text-muted-foreground",
          content && "animate-pulse",
        )}
      >
        {icon || <Book01Icon className="size-5" />}
      </p>
      <p
        className={cn(
          !content && "blur-2xs select-none",
          "text-sm text-nowrap text-ellipsis overflow-hidden",
          content && "animate-pulse",
        )}
      >
        {content || fillerText}
      </p>
    </div>
  );
};

const StepTitle = ({ children }: { children: React.ReactNode }) => {
  return <h3 className="text-lg font-semibold mb-2 mt-8">{children}</h3>;
};

export default AndroidInstallationGuide;
