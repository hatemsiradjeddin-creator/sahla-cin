import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, MessageCircle, Info, Scale, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/more")({
  head: () => ({
    meta: [
      { title: "Plus — Aide, contact et infos | BookCinéDZ" },
      {
        name: "description",
        content:
          "Signalez une erreur, rejoignez le groupe WhatsApp BookCinéDZ et consultez les mentions légales de l'application.",
      },
      { property: "og:title", content: "Plus — BookCinéDZ" },
      {
        property: "og:description",
        content: "Support, communauté WhatsApp et informations légales de BookCinéDZ.",
      },
    ],
  }),
  component: MorePage,
});

const errorTypes = [
  "Horaire incorrect",
  "Film manquant",
  "Informations cinéma erronées",
  "Problème de paiement",
  "Autre",
];

function MorePage() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(errorTypes[0]);
  const [message, setMessage] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 5) {
      toast.error("Merci de décrire le problème en quelques mots.");
      return;
    }
    setOpen(false);
    setMessage("");
    toast.success("Signalement envoyé", {
      description: "Merci ! Notre équipe traitera votre signalement rapidement.",
    });
  }

  return (
    <div className="min-h-screen pb-24">
      <AppHeader />
      <main className="mx-auto max-w-2xl space-y-4 px-4 pt-6">
        <h1 className="text-2xl font-bold tracking-tight">Plus</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15">
                <AlertTriangle className="size-5 text-primary" />
              </span>
              <span>
                <span className="block font-semibold">Signaler une erreur</span>
                <span className="block text-sm text-muted-foreground">
                  Horaire, film ou salle incorrects
                </span>
              </span>
            </button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Signaler une erreur</DialogTitle>
              <DialogDescription>
                Aidez-nous à garder les informations à jour pour tous les cinéphiles.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label>Type d'erreur</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {errorTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="msg">Message</Label>
                <Textarea
                  id="msg"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez le problème rencontré..."
                />
              </div>
              <Button type="submit" className="w-full rounded-xl">
                <Send className="size-4" />
                Envoyer le signalement
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <a
          href="https://chat.whatsapp.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15">
            <MessageCircle className="size-5 text-primary" />
          </span>
          <span>
            <span className="block font-semibold">Rejoindre le groupe WhatsApp</span>
            <span className="block text-sm text-muted-foreground">
              Actus et avant-premières en Algérie
            </span>
          </span>
        </a>

        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <Info className="size-5 text-primary" />À propos
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            BookCinéDZ est une application de réservation de tickets de cinéma en Algérie : horaires
            des salles, films à l'affiche et paiement local (CIB, BaridiMob, Dahabia).
          </p>
          <p className="mt-3 text-sm">
            Version <span className="font-semibold text-primary">BETA 1.0</span>
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <Scale className="size-5 text-primary" />
            Mentions légales
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Les affiches, titres et bandes-annonces restent la propriété de leurs ayants droit
            respectifs. Les horaires sont donnés à titre indicatif et peuvent être modifiés par les
            salles. BookCinéDZ n'est pas responsable des annulations de séances.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            © {new Date().getFullYear()} BookCinéDZ — Alger, Algérie.
          </p>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
