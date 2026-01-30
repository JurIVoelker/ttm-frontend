import Layout from "@/components/layout";
import Title from "@/components/title";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const InvalidLogin = () => {
  return (
    <Layout>
      <Title>Login fehlgeschlagen</Title>
      <p className="pt-6 text-muted-foreground">
        Der Login war nicht erfolgreich. Bitte versuche es erneut, oder
        kontaktiere einen Administrator, falls das Problem weiterhin besteht.
      </p>
      <div className="rounded-md border bg-card p-4 mt-4">
        <h3 className="font-medium flex gap-1.5 items-center">
          <AlertTriangle className="size-4.5 text-destructive" /> Hinweis
        </h3>
        <p className="text-sm mt-1">
          Der Login ist nur für Mannschaftsführer oder Administratoren möglich.
        </p>
      </div>
      <Link
        href="/login"
        className={cn(
          buttonVariants({
            variant: "outline",
          }),
          "mt-4 w-full",
        )}
      >
        Zurück zum Login
      </Link>
    </Layout>
  );
};

export default InvalidLogin;
