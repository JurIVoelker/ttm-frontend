import Layout from "@/components/layout";
import NavigationButtons from "@/components/navigation-buttons";
import SyncSettings from "@/components/sync-settings";
import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import { useFetchSync } from "@/hooks/use-fetch/use-fetch-sync";
import { sendRequest } from "@/lib/fetch-utils";
import { TTApiMatch } from "@/types/sync";
import { Tick01Icon } from "hugeicons-react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

const Synchronisation = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const data = useFetchSync();

  const onSave = async () => {
    setIsSaving(true);
    const filterSelectedMatches = (matches: TTApiMatch[] | undefined) => {
      if (!matches) return [];
      return matches.filter((match) => !selectedIds.includes(match.id));
    };

    data.setData({
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
      data.refetch();
    }
    setSelectedIds([]);
    setIsSaving(false);
  };

  const onSelectChange = (matchId: string) => {
    setSelectedIds((prev) => {
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
        className=" mt-8"
      />
      <SyncSettings className="mt-8" onSave={() => data.refetch()} />
      <div className="mt-6 space-y-2">
        <h2 className="text-lg font-medium">Neue Spiele</h2>
        {data.data?.missingMatches.map((match) => (
          <SyncItem
            key={match.id}
            match={match}
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
    </Layout>
  );
};

const SyncItem = ({
  match,
  children,
  selected = false,
  onSelectChange,
}: {
  match: TTApiMatch;
  children: React.ReactNode;
  selected?: boolean;
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
        <Button variant="outline" className="grow">
          Ignorieren
        </Button>
      </div>
    </div>
  );
};

export default Synchronisation;
