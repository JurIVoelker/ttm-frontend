"use client";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { showMessage } from "@/lib/message";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { SingleMatchDTO } from "@/types/match";
import TimeInput from "./ui/time-input";
import { DatePicker } from "./ui/date-picker";
import { Switch } from "./ui/switch";
import { mainStore } from "@/store/main-store";
import { sendRequest } from "@/lib/fetch-utils";
import NavigationButtons from "./navigation-buttons";

export type Time = {
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
};

interface EditMatchFormProps {
  match?: SingleMatchDTO | null;
  isCreate?: boolean;
}

const EditMatchForm: React.FC<EditMatchFormProps> = ({
  match,
  isCreate = false,
}) => {
  const [isLoading, setLoading] = useState(true);

  const { push } = useRouter();

  const teamSlug = mainStore((state) => state.teamSlug);

  useEffect(() => {
    setLoading(false);
  }, []);

  const FormSchema = z.object({
    date: z.date(),
    time: z
      .object({
        hour: z.number(),
        minute: z.number(),
        second: z.number(),
        millisecond: z.number(),
      })
      .loose(),
    hallName: z.string().min(1),
    streetAddress: z.string().min(1),
    city: z.string().min(1),
    isHomeGame: z.boolean(),
    enemyClubName: isCreate ? z.string().min(1) : z.undefined(),
    isCupMatch: z.boolean(),
  });

  const location = match?.location;
  const date = match?.time ? new Date(match?.time) : undefined;

  const time = {
    hour: date?.getHours() || 0,
    minute: date?.getMinutes() || 0,
    second: 0,
    millisecond: 0,
  };

  const locationOptions = ["Heimspiel", "Auswärts"];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      hallName: location?.hallName ?? "",
      streetAddress: location?.streetAddress ?? "",
      city: location?.city ?? "",
      isHomeGame: match?.isHomeGame ?? true,
      date,
      time,
      isCupMatch: match?.type === "CUP",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const copiedDate = new Date(data.date);
    copiedDate.setHours(0, 0, 0, 0);
    const now = new Date();
    if (copiedDate.valueOf() < now.setHours(0, 0, 0, 0)) {
      showMessage("Das Datum liegt in der Vergangenheit.", {
        variant: "error",
      });
      return;
    }
    let res;
    const date = new Date(data.date);
    date.setHours(data.time.hour, data.time.minute, 0, 0);
    if (!isCreate) {
      res = await sendRequest({
        path: `/api/match/${teamSlug}/${match?.id}`,
        method: "PUT",
        body: {
          time: date.toISOString(),
          isHomeGame: data.isHomeGame,
          location: {
            hallName: data.hallName,
            streetAddress: data.streetAddress,
            city: data.city,
          },
          type: data.isCupMatch ? "CUP" : "REGULAR",
        },
      });
    } else {
      res = await sendRequest({
        path: `/api/match/${teamSlug}`,
        method: "POST",
        body: {
          time: date.toISOString(),
          enemyName: data.enemyClubName,
          isHomeGame: data.isHomeGame,
          location: {
            hallName: data.hallName,
            streetAddress: data.streetAddress,
            city: data.city,
          },
          type: data.isCupMatch ? "CUP" : "REGULAR",
        },
      });
    }
    if (!res.ok) {
      // umami()?.track(`error:${isCreate ? "create-match" : "edit-match"}`);
      showMessage("Ein Fehler ist aufgetreten.", {
        variant: "error",
      });
    } else {
      showMessage(`Spiel erfolgreich ${isCreate ? "erstellt" : "bearbeitet"}`);
      push(`/${teamSlug}`);
    }
  };

  return (
    <Form {...form}>
      <form className="pb-16" onSubmit={form.handleSubmit(onSubmit)}>
        <NavigationButtons onSave={() => {}} isSaving={isLoading} />
        <div className="space-y-6">
          {isCreate && (
            <Card className="gap-4">
              <CardHeader className="text-muted-foreground font-medium">
                <h3>Name des Gegnerteams</h3>
              </CardHeader>
              <CardContent>
                <FormField
                  name="enemyClubName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Gegner..."
                          value={field.value}
                          onChange={(event) => {
                            field.onChange(event.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}
          <Card className="gap-4">
            <CardHeader className="text-muted-foreground font-medium">
              <h3>Datum und Uhrzeit</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                name="date"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DatePicker
                        onValueChange={field.onChange}
                        value={field.value}
                        className={"w-full"}
                        label="Spieldatum auswählen"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="time"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {isLoading ? (
                        <Skeleton className="h-10" />
                      ) : (
                        <TimeInput
                          onChange={field.onChange}
                          value={field.value as Time}
                          label="Spieluhrzeit eingeben"
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card className="gap-4">
            <CardHeader className="text-muted-foreground font-medium">
              <h3>Spielort</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                name="hallName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Hallenname..."
                        value={field.value}
                        onChange={(event) => {
                          field.onChange(event.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="streetAddress"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Straße und Nummer..."
                        value={field.value}
                        onChange={(event) => {
                          field.onChange(event.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Ort und PLZ..."
                        value={field.value}
                        onChange={(event) => {
                          field.onChange(event.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isHomeGame"
                render={({ field }) => (
                  <FormItem className="w-full space-y-4">
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) =>
                          field.onChange(value === locationOptions[0])
                        }
                        defaultValue={
                          typeof field.value === "boolean"
                            ? locationOptions[field.value ? 0 : 1]
                            : undefined
                        }
                        className="flex gap-2"
                      >
                        {locationOptions?.map((option, id) => (
                          <div
                            key={`${id}-${option}`}
                            className="w-full flex justify-center border-input has-data-[state=checked]:border-primary/50 relative gap-4 rounded-md border p-3 shadow-xs outline-none"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                id={`${id}-${option}`}
                                value={option}
                                className="after:absolute after:inset-0"
                              />
                              <Label htmlFor={`${id}-${option}`}>
                                {option}
                              </Label>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card className="p-4 space-y-4">
            <FormField
              control={form.control}
              name="isCupMatch"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex w-full justify-between items-center">
                      <Label htmlFor="isCupMatch" className="p-gray">
                        Pokalspiel
                      </Label>
                      <Switch
                        id="isCupMatch"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
        </div>
      </form>
    </Form>
  );
};

export default EditMatchForm;
