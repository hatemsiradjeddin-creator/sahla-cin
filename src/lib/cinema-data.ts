export type Movie = {
  id: string;
  title: string;
  titleAr: string;
  rating: number;
  duration: number;
  genres: string[];
  poster: string;
  algerian?: boolean;
  synopsis: string;
  trailer: string;
};

export const movies: Movie[] = [
  {
    id: "aquaman-2",
    title: "Aquaman et le Royaume Perdu",
    titleAr: "أكوامان والمملكة المفقودة",
    rating: 7.2,
    duration: 124,
    genres: ["Action", "Aventure"],
    poster: "https://image.tmdb.org/t/p/w500/8xV47NDrjdZDpkVcCFqkdHa3T0C.jpg",
    synopsis:
      "Black Manta, toujours animé par le besoin de venger la mort de son père, ne reculera devant rien pour vaincre Aquaman une fois pour toutes. Arthur Curry doit alors se tourner vers son frère emprisonné, Orm, pour former une alliance improbable et sauver Atlantis.",
    trailer: "https://www.youtube.com/results?search_query=Aquaman+et+le+Royaume+Perdu+bande+annonce",
  },
  {
    id: "wonka",
    title: "Wonka",
    titleAr: "ونكا",
    rating: 7.8,
    duration: 116,
    genres: ["Comédie", "Famille"],
    poster: "https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg",
    synopsis:
      "L'histoire extraordinaire de la façon dont le plus grand inventeur, magicien et chocolatier du monde est devenu le Willy Wonka que nous connaissons aujourd'hui, riche de rencontres et de rêves de chocolat.",
    trailer: "https://www.youtube.com/results?search_query=Wonka+bande+annonce+VF",
  },
  {
    id: "migration",
    title: "Migration",
    titleAr: "الهجرة",
    rating: 7.4,
    duration: 92,
    genres: ["Animation", "Famille"],
    poster: "https://image.tmdb.org/t/p/w500/ldfCF9RhR40mppkzmftxapaHeTo.jpg",
    synopsis:
      "La famille Mallard de canards colverts convainc le père, très protecteur, de partir en vacances. De New York à la Jamaïque, un voyage plein de péripéties les attend.",
    trailer: "https://www.youtube.com/results?search_query=Migration+film+bande+annonce+VF",
  },
  {
    id: "le-temps-daimer",
    title: "Le Temps d'Aimer",
    titleAr: "وقت الحب",
    rating: 8.1,
    duration: 105,
    genres: ["Drame", "Romance"],
    poster: "https://image.tmdb.org/t/p/w500/8xV47NDrjdZDpkVcCFqkdHa3T0C.jpg",
    algerian: true,
    synopsis:
      "Une fresque intime et bouleversante sur l'amour et la mémoire, portée par un regard algérien sensible sur les liens familiaux, l'exil et le passage du temps.",
    trailer: "https://www.youtube.com/results?search_query=Le+Temps+d%27Aimer+bande+annonce",
  },
];

export type Cinema = {
  id: string;
  name: string;
  address: string;
  phone: string;
  screens: number;
  city: string;
};

export const cinemas: Cinema[] = [
  {
    id: "ibn-zeydoun",
    name: "Ibn Zeydoun",
    address: "2 Rue Didouche Mourad, Alger",
    phone: "021 73 52 42",
    screens: 3,
    city: "Alger",
  },
  {
    id: "algeria",
    name: "Cinéma Algéria",
    address: "Blvd Zirout Youcef, Alger",
    phone: "021 63 78 15",
    screens: 2,
    city: "Alger",
  },
  {
    id: "el-mouggar",
    name: "El Mouggar",
    address: "Rue Asselah Hocine, Alger",
    phone: "021 74 28 90",
    screens: 1,
    city: "Alger",
  },
];

export const showtimes = ["14:00", "17:30", "21:00"];
export const cities = ["Alger", "Oran", "Constantine"];
export const SEAT_PRICE = 500;

export const paymentMethods = [
  { id: "cib", label: "Carte CIB", hint: "Paiement par carte interbancaire" },
  { id: "baridimob", label: "BaridiMob", hint: "Algérie Poste — paiement mobile" },
  { id: "dahabia", label: "Dahabia", hint: "Carte Edahabia Algérie Poste" },
];

export function mapsLink(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function bookingRef() {
  return "DZ-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}
