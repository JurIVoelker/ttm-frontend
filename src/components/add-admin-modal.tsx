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
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { sendRequest } from "@/lib/fetch-utils";
import { showMessage } from "@/lib/message";
import { Admin } from "@/types/admin";

type Suggestion = { id: string; fullName: string; email: string };

interface AddAdminModalProps {
  children: React.ReactNode;
  onAdd: (admin: Admin) => void;
  suggestions: Suggestion[];
}

export default function AddAdminModal({
  children,
  onAdd,
  suggestions,
}: AddAdminModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const isNameValid = name.trim().length > 0;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setIsFormValid(isNameValid && isEmailValid);
  }, [name, email]);

  const saveAdmin = async (fullName: string, email: string) => {
    setLoading(true);
    const res = await sendRequest({
      path: "/api/admin",
      method: "POST",
      body: { fullName, email: email.toLowerCase().trim() },
    });
    setLoading(false);
    if (!res.ok) {
      showMessage(`Der Admin konnte nicht hinzugefügt werden`, {
        variant: "error",
      });
    } else {
      setOpen(false);
      showMessage(`Der Admin wurde erfolgreich hinzugefügt`, {
        variant: "success",
      });
      const data = await res.json();
      onAdd(data);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      saveAdmin(name, email);
    }
  };

  const resetForm = (isOpen = false) => {
    setName("");
    setEmail("");
    setSearchValue("");
    setOpen(isOpen);
    setLoading(false);
  };

  const onSelectSuggestion = (suggestion: Suggestion) => {
    setName(suggestion.fullName);
    setEmail(suggestion.email);
    setSearchValue("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetForm}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Admin hinzufügen</DialogTitle>
          <DialogDescription>
            Fülle das Formular aus um einen neuen Admin hinzuzufügen.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {suggestions.length > 0 && (
              <Command className="w-full rounded-lg border">
                <CommandInput
                  placeholder="Vorhandene Person suchen..."
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandList className="max-h-36">
                  <CommandGroup heading="Vorschläge">
                    {suggestions.map((s) => (
                      <CommandItem
                        key={s.id}
                        value={s.fullName}
                        onSelect={() => onSelectSuggestion(s)}
                      >
                        {s.fullName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            )}
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
