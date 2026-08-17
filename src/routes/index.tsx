import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Star, Clock, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { movies, cities, type Movie } from "@/lib/cinema-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BookCinéDZ — Réservez vos places de cinéma en Algérie" },
      {
        name: "description",
        content:
          "Découvrez les films à l'affiche à Alger, Oran et Constantine et réservez vos tickets de cinéma en quelques secondes.",
      },
      { property: "og:title", content: "BookCinéDZ — Cinéma en Algérie" },
      {
        property: "og:description",
        content: "Films à l'affiche, horaires et réservation de tickets dans les cinémas algériens.",
      },
    ],
  }),
  component: Index,
});

function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      to="/movie/$movieId"
      params={{ movieId: movie.id }}
      className="group flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50"
    >
      <div className="relative h-32 w-22 shrink-0 overflow-hidden rounded-xl">
        <img
          src={movie.poster}
          alt={`Affiche du film ${movie.title}`}
          loading="lazy"
          className="h-32 w-22 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {movie.algerian && (
          <span className="absolute left-1 top-1 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
            🇩🇿 DZ
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <h3 className="truncate font-semibold leading-tight">{movie.title}</h3>
        <p className="arabic mt-0.5 truncate text-sm text-muted-foreground" dir="rtl">
          {movie.titleAr}
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 text-foreground">
            <Star className="size-3.5 fill-primary text-primary" />
            {movie.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {movie.duration} min
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {movie.genres.map((g) => (
            <Badge key={g} variant="secondary" className="rounded-full text-[11px] font-normal">
              {g}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}

function Index() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState(cities[0]!);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return movies;
    return movies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.titleAr.includes(query.trim()) ||
        m.genres.some((g) => g.toLowerCase().includes(q)),
    );
  }, [query]);

  const algerian = filtered.filter((m) => m.algerian);

  return (
    <div className="min-h-screen pb-24">
      <AppHeader
        right={
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-[140px] rounded-full border-border bg-card">
              <MapPin className="size-4 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <main className="mx-auto max-w-2xl px-4">
        <section className="hero-fade -mx-4 px-4 pb-4 pt-6">
          <h1 className="text-2xl font-bold tracking-tight">
            À l'affiche à <span className="text-primary">{city}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Réservez votre place en quelques secondes — 500 DA la séance.
          </p>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un film, un genre..."
              className="rounded-full border-border bg-card pl-9"
              aria-label="Rechercher un film"
            />
          </div>
        </section>

        {algerian.length > 0 && (
          <section className="mt-2">
            <div className="rounded-2xl border border-primary/40 bg-primary/10 p-3">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
                🇩🇿 Films Algériens
              </h2>
              <div className="space-y-3">
                {algerian.map((m) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Tous les films
          </h2>
          <div className="space-y-3">
            {filtered.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
            {filtered.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Aucun film ne correspond à « {query} ».
              </p>
            )}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
