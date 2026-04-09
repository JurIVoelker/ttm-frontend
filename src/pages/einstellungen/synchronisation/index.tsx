import Layout from "@/components/layout";
import NavigationButtons from "@/components/navigation-buttons";
import SyncSettings from "@/components/sync-settings";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetchSync } from "@/hooks/use-fetch/use-fetch-sync";
import { useFetchSyncIgnore } from "@/hooks/use-fetch/use-fetch-sync-ignore";
import { sendRequest } from "@/lib/fetch-utils";
import { showMessage } from "@/lib/message";
import { queryClient } from "@/lib/query";
import { TTApiMatch } from "@/types/sync";
import {
  DashboardCircleIcon,
  Settings01Icon,
  Tick01Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "hugeicons-react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { track } from "@/lib/umami";

const Synchronisation = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [ignoredIds, setIgnoredIds] = useState<string[]>([]);
  const [unignoreListIds, setUnignoreListIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const data = useFetchSync();
  const ignoredData = useFetchSyncIgnore();

  const onSave = async () => {
    setIsSaving(true);
    if (selectedIds.length) {
      await onSaveSync();
    }
    if (ignoredIds.length) {
      await onSaveIgnored();
    }
    if (unignoreListIds.length) {
      await onSaveUnignore();
    }
    if (!selectedIds.length && !ignoredIds.length && !unignoreListIds.length) {
      showMessage("Keine Änderungen zum Speichern", {
        variant: "error",
      });
      setIsSaving(false);
      return;
    }
    setSelectedIds([]);
    setIgnoredIds([]);
    setUnignoreListIds([]);
    data.refetch();
    ignoredData.refetch();
    setIsSaving(false);
  };

  const onSaveSync = async () => {
    const filterSelectedMatches = (matches: TTApiMatch[] | undefined) => {
      if (!matches) return [];
      return matches.filter((match) => !selectedIds.includes(match.id));
    };

    queryClient.setQueryData(["sync"], {
      ...data.data!,
      missingMatches: filterSelectedMatches(data.data?.missingMatches),
      unequalTimeMatches: filterSelectedMatches(data.data?.unequalTimeMatches),
      unequalHomeGameMatches: filterSelectedMatches(
        data.data?.unequalHomeGameMatches,
      ),
      unequalLocationMatches: filterSelectedMatches(
        data.data?.unequalLocationMatches,
      ),
    });

    const response = await sendRequest({
      method: "POST",
      path: "/api/sync/ids",
      body: {
        ids: selectedIds,
      },
    });
    if (!response.ok) {
      showMessage("Fehler beim Synchronisieren der Daten", {
        variant: "error",
      });
      return;
    }
    showMessage("Daten erfolgreich synchronisiert");
    track("sync-matches");
  };

  const onSaveIgnored = async () => {
    const response = await sendRequest({
      method: "POST",
      path: "/api/sync/ignore",
      body: {
        ids: ignoredIds,
      },
    });

    if (!response.ok) {
      showMessage("Fehler beim Speichern der ignorierten Spiele", {
        variant: "error",
      });
    } else {
      showMessage("Ignorierte Spiele erfolgreich gespeichert");
    }
  };

  const onSaveUnignore = async () => {
    const response = await sendRequest({
      method: "DELETE",
      path: "/api/sync/ignore",
      body: {
        ids: unignoreListIds,
      },
    });

    if (!response.ok) {
      showMessage("Fehler beim Aufheben der Ignorierung der Spiele", {
        variant: "error",
      });
    } else {
      showMessage("Ignorierung der Spiele erfolgreich aufgehoben");
    }
  };

  const onSelectChange = (matchId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(matchId)) {
        return prev.filter((id) => id !== matchId);
      }
      return [...prev, matchId];
    });
  };

  const onIgnoreChange = (matchId: string) => {
    setIgnoredIds((prev) => {
      if (prev.includes(matchId)) {
        return prev.filter((id) => id !== matchId);
      }
      return [...prev, matchId];
    });
  };

  const onUnignoreChange = (matchId: string) => {
    setUnignoreListIds((prev) => {
      if (prev.includes(matchId)) {
        return prev.filter((id) => id !== matchId);
      }
      return [...prev, matchId];
    });
  };

  const isUpdateableMatchAvailable =
    data.data?.unequalHomeGameMatches.length ||
    data.data?.unequalLocationMatches.length ||
    data.data?.unequalTimeMatches.length;

  return (
    <Layout>
      <Title>Synchronisation</Title>
      <NavigationButtons
        isSaving={isSaving}
        onSave={onSave}
        backNavigation="/einstellungen"
        className="mt-8"
      />
      <Tabs defaultValue="overview">
        <TabsList className="max-w-[calc(100vw-3rem)] overflow-hidden w-full md:mt-8">
          <TabsTrigger value="overview" className="flex items-center min-w-0">
            <DashboardCircleIcon strokeWidth={2} />
            <span className="truncate">Übersicht</span>
          </TabsTrigger>
          <TabsTrigger
            value="ignored-matches"
            className="flex items-center min-w-0"
          >
            <ViewOffSlashIcon strokeWidth={2} />
            <span className="truncate">Ingnorierte Spiele</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center min-w-0">
            <Settings01Icon strokeWidth={2} />
            <span className="truncate">Einstellungen</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="mt-6 space-y-2">
            {data.data?.missingMatches.length !== 0 && (
              <h2 className="text-lg font-medium">Neue Spiele</h2>
            )}
            {data.data?.missingMatches.map((match) => (
              <SyncItem
                key={match.id}
                match={match}
                ignored={ignoredIds.includes(match.id)}
                onIgnoreChange={onIgnoreChange}
                selected={selectedIds.includes(match.id)}
                onSelectChange={onSelectChange}
              >
                <div>
                  {match.teams.home.name}{" "}
                  <span className="text-muted-foreground">-</span>{" "}
                  {match.teams.away.name}
                </div>
                <p className="text-muted-foreground text-xs">
                  {new Date(match.datetime).toLocaleString()}
                </p>
              </SyncItem>
            ))}
            {isUpdateableMatchAvailable !== 0 && (
              <h2 className="text-lg font-medium mt-6">Veraltete Daten</h2>
            )}
            {data.data?.unequalTimeMatches.map((match, index) => (
              <SyncItem
                key={match.id}
                match={match}
                ignored={ignoredIds.includes(match.id)}
                onIgnoreChange={onIgnoreChange}
                selected={selectedIds.includes(match.id)}
                onSelectChange={onSelectChange}
              >
                <div>
                  {match.teams.home.name}{" "}
                  <span className="text-muted-foreground">-</span>{" "}
                  {match.teams.away.name}
                </div>
                <div className="text-muted-foreground text-xs">
                  <span className="line-through mr-1.5">
                    {new Date(
                      data?.data?.unequalTimeMatchesBefore[index]?.time || 0,
                    ).toLocaleString()}
                  </span>
                  {new Date(match.datetime).toLocaleString()}
                </div>
              </SyncItem>
            ))}
            {data.data?.unequalHomeGameMatches.map((match) => (
              <SyncItem
                key={match.id}
                match={match}
                selected={selectedIds.includes(match.id)}
                ignored={ignoredIds.includes(match.id)}
                onIgnoreChange={onIgnoreChange}
                onSelectChange={onSelectChange}
              >
                <div>
                  {match.teams.home.name}{" "}
                  <span className="text-muted-foreground">-</span>{" "}
                  {match.teams.away.name}
                </div>
                <div className="text-muted-foreground text-xs">
                  <span className="line-through mr-1.5">
                    {match.isHomeGame ? "Auswärtsspiel" : "Heimspiel"}
                  </span>
                  {match.isHomeGame ? "Heimspiel" : "Auswärtsspiel"}
                </div>
              </SyncItem>
            ))}
            {data.data?.unequalLocationMatches.map((match) => (
              <SyncItem
                key={match.id}
                match={match}
                selected={selectedIds.includes(match.id)}
                ignored={ignoredIds.includes(match.id)}
                onIgnoreChange={onIgnoreChange}
                onSelectChange={onSelectChange}
              >
                <div>
                  {match.teams.home.name}{" "}
                  <span className="text-muted-foreground">-</span>{" "}
                  {match.teams.away.name}
                </div>
                <div className="text-muted-foreground text-xs">
                  <span>Neue Adresse: </span>
                  {match.location.address.city}, {match.location.address.street}{" "}
                  {match.location.address.zip}
                </div>
              </SyncItem>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="ignored-matches">
          <div className="space-y-2 mt-6">
            {ignoredData.data?.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Keine ignorierten Spiele
              </p>
            )}
            {ignoredData.data?.map((match) => (
              <IgnoredItem
                key={match.id}
                match={match}
                unignored={unignoreListIds.includes(match.id)}
                onIgnoreChange={onUnignoreChange}
              >
                <div>
                  {match.teams.home.name}{" "}
                  <span className="text-muted-foreground">-</span>{" "}
                  {match.teams.away.name}
                </div>
                <p className="text-muted-foreground text-xs">
                  {new Date(match.datetime).toLocaleString()}
                </p>
              </IgnoredItem>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <SyncSettings className="mt-8" onSave={() => data.refetch()} />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

const SyncItem = ({
  match,
  children,
  selected = false,
  ignored = false,
  onIgnoreChange,
  onSelectChange,
}: {
  match: TTApiMatch;
  children: React.ReactNode;
  selected?: boolean;
  ignored?: boolean;
  onIgnoreChange?: (matchId: string) => void;
  onSelectChange: (matchId: string) => void;
}) => {
  return (
    <div key={match.id} className="border rounded-md p-3 text-sm">
      {children}
      <div className="grid mt-2 gap-2 grid-cols-2">
        <Button
          className="grow"
          variant={selected ? "default" : "secondary"}
          onClick={() => {
            onSelectChange(match.id);
          }}
        >
          {selected ? (
            <Tick01Icon strokeWidth={2} />
          ) : (
            <PlusIcon strokeWidth={2} />
          )}
          Sync
        </Button>
        <Button
          variant={ignored ? "default" : "outline"}
          className="grow"
          onClick={() => onIgnoreChange?.(match.id)}
        >
          {ignored && <ViewOffSlashIcon strokeWidth={2} />}
          {!ignored && <ViewIcon strokeWidth={2} />}
          Ignorieren
        </Button>
      </div>
    </div>
  );
};

const IgnoredItem = ({
  match,
  children,
  unignored = false,
  onIgnoreChange,
}: {
  match: TTApiMatch;
  children: React.ReactNode;
  unignored: boolean;
  onIgnoreChange?: (matchId: string) => void;
}) => {
  return (
    <div key={match.id} className="border rounded-md p-3 text-sm">
      {children}
      <div className="mt-2">
        <Button
          variant={unignored ? "default" : "outline"}
          className="w-full"
          onClick={() => onIgnoreChange?.(match.id)}
        >
          {unignored && <ViewIcon strokeWidth={2} />}
          {!unignored && <ViewOffSlashIcon strokeWidth={2} />}
          {unignored ? "Ignorieren" : "Ignorierung aufheben"}
        </Button>
      </div>
    </div>
  );
};

export default Synchronisation;
