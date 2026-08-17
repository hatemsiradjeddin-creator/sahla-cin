import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Monitor, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { cinemas, mapsLink } from "@/lib/cinema-data";

export const Route = createFileRoute("/cinemas")({
  head: () => ({
    meta: [
      { title: "Cinemas à Alger — BookCinéDZ" },
      {
        name: "description",
        content:
          "Adresses, téléphones et nombre de salles des cinémas d'Alger : Ibn Zeydoun, Cinéma Algéria et El Mouggar.",
      },
      { property: "og:title", content: "Cinemas à Alger — BookCinéDZ" },
      {
        property: "og:description",
        content: "Retrouvez les salles de cinéma d'Alger et l'itinéraire pour s'y rendre.",
      },
    ],
  }),
  component: CinemasPage,
});

function CinemasPage() {
  return (
    <div className="min-h-screen pb-24">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 pt-6">
        <h1 className="text-2xl font-bold tracking-tight">Cinemas</h1>
        <p className="mt-1 text-sm text-muted-foreground">{cinemas.length} salles à Alger</p>

        <div className="mt-5 space-y-3">
          {cinemas.map((c) => (
            <article
              key={c.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold">{c.name}</h2>
                <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                  <Monitor className="size-3.5" />
                  {c.screens} salle{c.screens > 1 ? "s" : ""}
                </span>
              </div>
              <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                {c.address}
              </p>
              <a
                href={`tel:${c.phone.replace(/\s/g, "")}`}
                className="mt-1 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="size-4 shrink-0 text-primary" />
                {c.phone}
              </a>
              <Button
                asChild
                className="mt-4 w-full rounded-xl transition-transform active:scale-[0.98]"
              >
                <a
                  href={mapsLink(`${c.name} ${c.address}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="size-4" />
                  Get Directions
                </a>
              </Button>
            </article>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
