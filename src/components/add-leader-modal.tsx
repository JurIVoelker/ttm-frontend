"use client";

import type React from "react";
import { useState, useEffect } from "react";
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

interface AddLeaderModalProps {
  children: React.ReactNode;
  teamSlug: string;
  onAdd: (leader: LeaderDTO) => void;
}

export default function AddLeaderModal({
  children,
  teamSlug,
  onAdd,
}: AddLeaderModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const isNameValid = name.trim().length > 0;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setIsFormValid(isNameValid && isEmailValid);
  }, [name, email]);

  const saveLeader = async (fullName: string, email: string) => {
    setLoading(true);
    const res = await sendRequest({
      path: "/api/leader/" + teamSlug,
      method: "POST",
      body: { fullName, email: email.toLowerCase().trim() },
    });
    setLoading(false);
    if (!res.ok) {
      showMessage(`Der Mannschaftsführer konnte nicht hinzugefügt werden`, {
        variant: "error",
      });
    } else {
      setOpen(false);
      showMessage(`Der Mannschaftsführer wurde erfolgreich hinzugefügt`, {
        variant: "success",
      });
      const data = await res.json();
      onAdd(data);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      saveLeader(name, email);
    }
  };

  const resetForm = (isOpen = false) => {
    setName("");
    setEmail("");
    setOpen(isOpen);
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetForm}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mannschaftsführer hinzufügen</DialogTitle>
          <DialogDescription>
            Fülle das Formular aus um einen neuen Mannschaftsführer
            hinzuzufügen.
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!isFormValid || isLoading}>
              Hinzufügen
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
