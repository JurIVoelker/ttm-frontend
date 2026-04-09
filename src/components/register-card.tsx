"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useRouter } from "next/router";
import { GoogleIcon } from "hugeicons-react";
import { track } from "@/lib/umami";

// Define the form validation schema
const formSchema = z
  .object({
    email: z.string().email({ message: "Ungültige E-Mail-Adresse" }),
    password: z
      .string()
      .min(8, { message: "Passwort muss mindestens 8 Zeichen lang sein" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export const RegisterCard = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { push } = useRouter();

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    if (!res.ok) {
      if (res.status === 400) {
        setError(
          "Deine E-Mail-Adresse ist keinem Mannschaftsführer zugewiesen. \
        Bitte einen Admin darum, dich als Mannschaftsführer in einer \
        Mannschaft aufzunehmen und versuche es erneut.",
        );
        track("error:register", { reason: "leader-not-found" });
      }
      if (res.status === 409) {
        setError(
          "Diese E-Mail-Adresse ist bereits registriert. Bitte logge dich ein.",
        );
        track("error:register", { reason: "already-registered" });
      }
    } else {
      track("register");
    }
    setIsSubmitting(false);
  };

  const onGoogleLogin = () => {
    push(`/api/auth/login/google`);
  };

  return (
    <Card className="w-[90%] max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-bold">Registrieren</CardTitle>
        <CardDescription>
          Wenn du Mannschaftsführer bist, kannst du dich hier registrieren.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail-Adresse</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="mail@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passwort</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passwort wiederholen</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Wird registriert..." : "Registrieren"}
            </Button>

            <p className="text-sm text-destructive">{error}</p>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Oder fortfahren mit
                </span>
              </div>
            </div>
            <Button onClick={onGoogleLogin} className="w-full">
              <GoogleIcon strokeWidth={2} /> Google
            </Button>
          </CardContent>
        </form>
      </Form>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {"Du hast bereits einen Account? "}
          <Link href="./login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterCard;
