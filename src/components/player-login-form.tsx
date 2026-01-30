import {
  COULD_NOT_FETCH_PLAYERS_BY_INVITE_TOKEN,
  INVALID_INVITE_LINK,
} from "@/constants/error";
import useAuthStore from "@/hooks/use-auth-store";
import { mainStore } from "@/store/main-store";
import { PlayersOfTeamDTO } from "@/types/player";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Button } from "./ui/button";
import { fetchPlayersWithInviteToken, loginPlayer } from "@/lib/fetch-utils";
import { useRouter } from "next/router";
import { Skeleton } from "./ui/skeleton";

const PlayerLogin = () => {
  const teamSlug = mainStore((state) => state.teamSlug);
  const authStore = useAuthStore();
  const [players, setPlayers] = useState<PlayersOfTeamDTO[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamSlug || authStore.loading) return;
    const inviteToken = new URLSearchParams(window.location.search).get(
      "inviteToken",
    );

    if (!inviteToken) {
      setIsLoading(false);
      setError(INVALID_INVITE_LINK);
      return;
    }

    setIsLoading(true);
    fetchPlayersWithInviteToken(inviteToken || "", teamSlug || "")
      .then((players) => {
        authStore.authStore.setInviteToken(inviteToken);
        setPlayers(players);
      })
      .catch((error) => {
        console.error(error);
        if (
          error instanceof Error &&
          error.message === COULD_NOT_FETCH_PLAYERS_BY_INVITE_TOKEN
        ) {
          setError(COULD_NOT_FETCH_PLAYERS_BY_INVITE_TOKEN);
        } else {
          setError("unknown");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamSlug, authStore.loading]);

  if (error) {
    return (
      <div className="text-destructive mt-6">
        {error === INVALID_INVITE_LINK ||
        error === COULD_NOT_FETCH_PLAYERS_BY_INVITE_TOKEN
          ? "Der von dir verwendete Einladungslink ist ungültig. Bitte kontaktiere deinen Mannschaftsführer."
          : error.startsWith("401_")
            ? "Unerwarteter Authentifizierungsfehler. Bitte versuche es erneut. Falls das Problem weiterhin besteht, kontaktiere einen Mannschaftsführer."
            : "Ein unbekannter Fehler ist aufgetreten. Bitte versuche es erneut."}
      </div>
    );
  }

  if (isLoading || players === null) {
    return <Skeleton className="w-full h-100 mt-6" />;
  }

  if (players.length === 0) {
    return <div>Keine Spieler gefunden für diesen Einladungslink.</div>;
  }

  return (
    <div>
      <Card className="gap-4 mt-6">
        <CardHeader>
          <CardTitle>Spielerauswahl</CardTitle>
          <CardDescription>
            Willkommen! Bitte wähle deinen Namen aus der Liste aus.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlayerLoginForm players={players} />
        </CardContent>
      </Card>
    </div>
  );
};

const PlayerLoginForm = ({ players }: { players: PlayersOfTeamDTO[] }) => {
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  const FormSchema = z.object({
    playerId: z.enum(
      players.map((p) => p.id),
      {
        error: "Bitte wähle einen Spieler aus.",
      },
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    const res = await loginPlayer(data.playerId);
    if (res) {
      push(`/${mainStore.getState().teamSlug}`);
    }
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="playerId"
          render={({ field }) => (
            <FormItem className="w-full mb-6">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {players?.map((player) => (
                    <FormItem
                      key={player.id}
                      className="flex items-center space-x-1"
                    >
                      <FormControl>
                        <RadioGroupItem value={player.id} />
                      </FormControl>
                      <FormLabel className="font-normal inline">
                        {player.fullName}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          Einloggen
        </Button>
      </form>
    </Form>
  );
};

export default PlayerLogin;
