import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Star, Clock, Play, Minus, Plus, Ticket, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BottomNav } from "@/components/BottomNav";
import {
  movies,
  cinemas,
  showtimes,
  paymentMethods,
  SEAT_PRICE,
  bookingRef,
  type Cinema,
} from "@/lib/cinema-data";

export const Route = createFileRoute("/movie/$movieId")({
  loader: ({ params }) => {
    const movie = movies.find((m) => m.id === params.movieId);
    if (!movie) throw notFound();
    return { movie };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Film introuvable — BookCinéDZ" }, { name: "robots", content: "noindex" }],
      };
    }
    const { movie } = loaderData;
    const desc = `${movie.title} — ${movie.genres.join(", ")}, ${movie.duration} min. Horaires et réservation dans les cinémas d'Alger.`;
    return {
      meta: [
        { title: `${movie.title} — Séances & réservation | BookCinéDZ` },
        { name: "description", content: desc },
        { property: "og:title", content: `${movie.title} — BookCinéDZ` },
        { property: "og:description", content: desc },
        { property: "og:image", content: movie.poster },
        { name: "twitter:image", content: movie.poster },
      ],
    };
  },
  component: MovieDetail,
});

type Selection = { cinema: Cinema; time: string };

function MovieDetail() {
  const { movie } = Route.useLoaderData();
  const [selection, setSelection] = useState<Selection | null>(null);
  const [seats, setSeats] = useState(2);
  const [payment, setPayment] = useState(paymentMethods[0]!.id);
  const [ticket, setTicket] = useState<null | {
    ref: string;
    time: string;
    cinema: string;
    seats: number;
    date: string;
  }>(null);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  function confirm() {
    if (!selection) return;
    const ref = bookingRef();
    setTicket({
      ref,
      time: selection.time,
      cinema: selection.cinema.name,
      seats,
      date: today,
    });
    setSelection(null);
    toast.success("Paiement confirmé", { description: `Référence ${ref}` });
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="relative">
        <img
          src={movie.poster}
          alt={`Affiche du film ${movie.title}`}
          className="h-[52vh] max-h-[420px] w-full object-cover"
        />
        <div className="poster-fade absolute inset-0" />
        <Link
          to="/"
          className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full bg-background/70 backdrop-blur transition-colors hover:bg-background"
          aria-label="Retour"
        >
          <ArrowLeft className="size-5" />
        </Link>
        {movie.algerian && (
          <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
            🇩🇿 Film Algérien
          </span>
        )}
      </div>

      <main className="mx-auto -mt-10 max-w-2xl px-4">
        <h1 className="text-2xl font-bold leading-tight">{movie.title}</h1>
        <p className="arabic mt-1 text-lg text-muted-foreground" dir="rtl">
          {movie.titleAr}
        </p>

        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <Star className="size-4 fill-primary text-primary" />
            {movie.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-4" />
            {movie.duration} min
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {movie.genres.map((g) => (
            <Badge key={g} variant="secondary" className="rounded-full font-normal">
              {g}
            </Badge>
          ))}
        </div>

        <Button
          asChild
          variant="outline"
          className="mt-4 w-full rounded-xl border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
        >
          <a href={movie.trailer} target="_blank" rel="noopener noreferrer">
            <Play className="size-4" />
            Voir la bande-annonce
          </a>
        </Button>

        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Synopsis
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{movie.synopsis}</p>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Séances — {today}
          </h2>
          <div className="mt-3 space-y-3">
            {cinemas.map((c) => (
              <div key={c.id} className="rounded-2xl border border-border bg-card p-4">
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.address}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {showtimes.map((t) => (
                    <Button
                      key={t}
                      size="sm"
                      className="rounded-xl px-5 transition-transform active:scale-95"
                      onClick={() => {
                        setSeats(2);
                        setSelection({ cinema: c, time: t });
                      }}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Booking flow */}
      <Dialog open={!!selection} onOpenChange={(o) => !o && setSelection(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Réserver — {movie.title}</DialogTitle>
            <DialogDescription>
              {selection?.cinema.name} · {today} · {selection?.time}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-medium">Nombre de places</p>
              <div className="flex items-center justify-between rounded-xl border border-border bg-card p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="Retirer une place"
                  disabled={seats <= 1}
                  onClick={() => setSeats((s) => Math.max(1, s - 1))}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="text-xl font-bold">{seats}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="Ajouter une place"
                  disabled={seats >= 6}
                  onClick={() => setSeats((s) => Math.min(6, s + 1))}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Maximum 6 places par réservation</p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Moyen de paiement</p>
              <div className="space-y-2">
                {paymentMethods.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPayment(p.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors ${
                      payment === p.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-medium">{p.label}</span>
                      <span className="block text-xs text-muted-foreground">{p.hint}</span>
                    </span>
                    {payment === p.id && <CheckCircle2 className="size-5 text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {seats} × {SEAT_PRICE} DA
              </span>
              <span className="text-xl font-bold text-primary">{seats * SEAT_PRICE} DA</span>
            </div>

            <Button
              className="w-full rounded-xl py-6 text-base transition-transform active:scale-[0.98]"
              onClick={confirm}
            >
              <Ticket className="size-5" />
              Confirmer & Payer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket */}
      <Dialog open={!!ticket} onOpenChange={(o) => !o && setTicket(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Votre ticket</DialogTitle>
            <DialogDescription>Présentez ce QR code à l'entrée de la salle.</DialogDescription>
          </DialogHeader>
          {ticket && (
            <div className="rounded-2xl border border-border bg-card p-5 text-center">
              <div className="mx-auto w-fit rounded-xl bg-white p-3">
                <QRCodeSVG value={`BOOKCINEDZ|${ticket.ref}|${movie.title}|${ticket.time}`} size={148} />
              </div>
              <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
                Référence
              </p>
              <p className="text-lg font-bold text-primary">{ticket.ref}</p>
              <Separator className="my-4" />
              <dl className="space-y-2 text-left text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Film</dt>
                  <dd className="font-medium">{movie.title}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Cinéma</dt>
                  <dd className="font-medium">{ticket.cinema}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Date</dt>
                  <dd className="font-medium">{ticket.date}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Heure</dt>
                  <dd className="font-medium">{ticket.time}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Places</dt>
                  <dd className="font-medium">{ticket.seats}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Total payé</dt>
                  <dd className="font-bold text-primary">{ticket.seats * SEAT_PRICE} DA</dd>
                </div>
              </dl>
              <Button className="mt-5 w-full rounded-xl" onClick={() => setTicket(null)}>
                Terminé
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
