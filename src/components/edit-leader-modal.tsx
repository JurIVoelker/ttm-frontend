"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { sendRequest } from "@/lib/fetch-utils";
import { showMessage } from "@/lib/message";
import { LeaderDTO } from "@/types/leader";
import { track } from "@/lib/umami";
import { EMAIL_REGEX } from "@/lib/validation";

interface EditLeaderModalProps {
  children: React.ReactNode;
  leader: LeaderDTO;
  onEdit: (leader: LeaderDTO) => void;
}

export default function EditLeaderModal({
  children,
  leader,
  onEdit,
}: EditLeaderModalProps) {
  const [name, setName] = useState(leader.fullName);
  const [email, setEmail] = useState(leader.email);
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const isFormValid = name.trim().length > 0 && EMAIL_REGEX.test(email);

  const saveLeader = async (fullName: string, email: string) => {
    setLoading(true);
    const res = await sendRequest({
      path: "/api/leader",
      method: "PUT",
      body: { id: leader.id, fullName, email: email.toLowerCase().trim() },
    });
    setLoading(false);
    if (!res.ok) {
      track("error:edit-leader");
      showMessage(`Der Mannschaftsführer konnte nicht aktualisiert werden`, {
        variant: "error",
      });
    } else {
      track("edit-leader");
      setOpen(false);
      showMessage(`Der Mannschaftsführer wurde erfolgreich aktualisiert`, {
        variant: "success",
      });
      const data = await res.json();
      onEdit({ ...leader, ...data.leader });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      saveLeader(name, email);
    }
  };

  const resetForm = (isOpen: boolean) => {
    setName(leader.fullName);
    setEmail(leader.email);
    setOpen(isOpen);
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetForm}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mannschaftsführer bearbeiten</DialogTitle>
          <DialogDescription>
            Bearbeite die Daten des Mannschaftsführers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <Input
                id="email"
                type="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!isFormValid || isLoading}>
              Speichern
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
