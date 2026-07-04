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
import { Admin } from "@/types/admin";
import { track } from "@/lib/umami";
import { EMAIL_REGEX } from "@/lib/validation";

interface EditAdminModalProps {
  children: React.ReactNode;
  admin: Admin;
  onEdit: (admin: Admin) => void;
}

export default function EditAdminModal({
  children,
  admin,
  onEdit,
}: EditAdminModalProps) {
  const [name, setName] = useState(admin.fullName);
  const [email, setEmail] = useState(admin.email);
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const isFormValid = name.trim().length > 0 && EMAIL_REGEX.test(email);

  const saveAdmin = async (fullName: string, email: string) => {
    setLoading(true);
    const res = await sendRequest({
      path: "/api/admin",
      method: "PUT",
      body: { id: admin.id, fullName, email: email.toLowerCase().trim() },
    });
    setLoading(false);
    if (!res.ok) {
      track("error:edit-admin");
      showMessage(`Der Admin konnte nicht aktualisiert werden`, {
        variant: "error",
      });
    } else {
      track("edit-admin");
      setOpen(false);
      showMessage(`Der Admin wurde erfolgreich aktualisiert`, {
        variant: "success",
      });
      const data = await res.json();
      onEdit(data.admin);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      saveAdmin(name, email);
    }
  };

  const resetForm = (isOpen: boolean) => {
    setName(admin.fullName);
    setEmail(admin.email);
    setOpen(isOpen);
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetForm}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Admin bearbeiten</DialogTitle>
          <DialogDescription>
            Bearbeite die Daten des Admins.
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
