import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { fetchMyTickets } from "@/lib/api";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/tickets")({
  head: () => ({
    meta: [
      { title: "Mes billets de cinéma — BookCinéDZ" },
      {
        name: "description",
        content: "Retrouvez vos billets électroniques avec QR code et présentez-les à l'entrée de la salle.",
      },
      { property: "og:title", content: "Mes billets — BookCinéDZ" },
      { property: "og:description", content: "Vos billets de cinéma avec QR code." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TicketsPage,
});

const fmt = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

type TicketRow = {
  id: string;
  qr_code: string;
  scanned: boolean;
  booking: {
    total_amount: number;
    status: string;
    booking_seats: { seat: { row_label: string; seat_number: number } | null }[];
    screening: {
      starts_at: string;
      audio_language: string;
      movie: { title: string };
      hall: { name: string; cinema: { name: string } };
    } | null;
  } | null;
};

function TicketsPage() {
  const { user, loading } = useAuth();
  const tickets = useQuery({
    queryKey: ["my-tickets", user?.id],
    queryFn: fetchMyTickets,
    enabled: !!user,
  });

  return (
    <div className="min-h-screen pb-24">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight">{t.tickets.title}</h1>

        {!user && !loading && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">{t.booking.needAuth}</p>
            <Button asChild className="mt-4 rounded-xl">
              <Link to="/auth" search={{ redirect: "/tickets" }}>
                {t.common.signIn}
              </Link>
            </Button>
          </div>
        )}

        {tickets.isLoading && user && <Skeleton className="mt-6 h-60 rounded-2xl" />}

        {user && tickets.data?.length === 0 && (
          <p className="mt-6 text-sm text-muted-foreground">{t.tickets.empty}</p>
        )}

        <div className="mt-6 space-y-4">
          {((tickets.data ?? []) as unknown as TicketRow[]).map((tk) => {
            const s = tk.booking?.screening;
            const seats = (tk.booking?.booking_seats ?? [])
              .map((bs) => (bs.seat ? `${bs.seat.row_label}${bs.seat.seat_number}` : ""))
              .filter(Boolean)
              .join(", ");
            return (
              <article key={tk.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold">{s?.movie.title ?? "Séance"}</h2>
                    <p className="text-xs text-muted-foreground">
                      {s?.hall.cinema.name} · {s?.hall.name}
                    </p>
                    {s && (
                      <p className="text-xs text-muted-foreground">{fmt.format(new Date(s.starts_at))}</p>
                    )}
                  </div>
                  <Badge variant={tk.scanned ? "secondary" : "default"}>
                    {tk.scanned ? t.tickets.scanned : t.tickets.valid}
                  </Badge>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-col items-center">
                  <div className="rounded-xl bg-white p-3">
                    <QRCodeSVG value={tk.qr_code} size={132} />
                  </div>
                  <p className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t.tickets.ref}
                  </p>
                  <p className="font-mono text-sm font-bold text-gold">{tk.qr_code}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{t.tickets.show}</p>
                </div>

                <dl className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Sièges</dt>
                    <dd className="font-medium">{seats || "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Total</dt>
                    <dd className="font-bold text-gold">
                      {tk.booking?.total_amount} {t.common.da}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Statut</dt>
                    <dd className="font-medium">
                      {tk.booking?.status === "confirme" ? t.booking.confirmed : t.booking.pending}
                    </dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
