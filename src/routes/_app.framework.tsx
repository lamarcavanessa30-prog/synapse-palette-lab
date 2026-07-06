import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookMarked,
  Brain,
  Heart,
  Compass,
  Zap,
  Users,
  Shield,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  EyeOff,
  RefreshCw,
  FileX,
  MessageCircle,
  BookOpen,
  ClipboardList,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

export const Route = createFileRoute("/_app/framework")({
  component: FrameworkPage,
});

type DomainId = "cbt" | "dbt" | "act" | "adhd" | "attachment" | "trauma" | "strengths";

type Confidence = "low" | "moderate" | "high";

type Trend = "up" | "down" | "stable";

type Pattern = {
  id: string;
  name: string;
  description: string;
  frequency: number; // Demo-only visual intensity, 0-100.
  examples: string[];
  trend: Trend;
  evolution: string;
  confidence: Confidence;
  evidenceCount: number;
  updatedAt: string;
  sources: { type: "chat" | "journal" | "questionnaire" | "behavior"; label: string; date: string }[];
};

type Domain = {
  id: DomainId;
  label: string;
  acronym: string;
  description: string;
  icon: typeof Brain;
  accent: string;
  patterns: Pattern[];
};

// ——— Demo content ———

const DOMAINS: Domain[] = [
  {
    id: "cbt",
    label: "Lente cognitivo-comportamentale",
    acronym: "CBT",
    description:
      "Osserva come pensieri, emozioni e comportamenti si influenzano. Aiuta a nominare ricorrenze nel racconto personale.",
    icon: Brain,
    accent: "from-primary/15 to-primary/5",
    patterns: [
      {
        id: "cbt-aon",
        name: "Pensiero tutto-o-nulla",
        description:
          "Tendenza a leggere le situazioni in categorie estreme, senza sfumature intermedie.",
        frequency: 64,
        examples: [
          "“Se non lo faccio perfettamente, è un fallimento.”",
          "“O sono produttiva, o sto sprecando la giornata.”",
        ],
        trend: "down",
        evolution: "Esempio demo: andamento illustrativo, non calcolato sui dati reali.",
        confidence: "high",
        evidenceCount: 27,
        updatedAt: "2 giorni fa",
        sources: [
          { type: "chat", label: "Conversazione del 9 giugno", date: "9 giu" },
          { type: "journal", label: "Voce di diario · «La presentazione»", date: "6 giu" },
          { type: "questionnaire", label: "Check-in settimanale", date: "3 giu" },
        ],
      },
      {
        id: "cbt-cat",
        name: "Catastrofizzazione",
        description: "Anticipare lo scenario peggiore come se fosse certo.",
        frequency: 41,
        examples: ["“Se sbaglio, perderò la fiducia di tutti.”"],
        trend: "stable",
        evolution: "Stabile nelle ultime settimane.",
        confidence: "moderate",
        evidenceCount: 14,
        updatedAt: "5 giorni fa",
        sources: [
          { type: "chat", label: "Conversazione del 4 giugno", date: "4 giu" },
          { type: "journal", label: "Voce di diario · «Notte inquieta»", date: "2 giu" },
        ],
      },
      {
        id: "cbt-pers",
        name: "Personalizzazione",
        description: "Attribuire a sé la responsabilità di eventi indipendenti dalla propria volontà.",
        frequency: 33,
        examples: ["“Se Marco è di malumore, dipende da qualcosa che ho detto io.”"],
        trend: "down",
        evolution: "Lieve diminuzione nell'ultimo mese.",
        confidence: "moderate",
        evidenceCount: 11,
        updatedAt: "1 settimana fa",
        sources: [
          { type: "chat", label: "Conversazione del 28 maggio", date: "28 mag" },
        ],
      },
      {
        id: "cbt-emo",
        name: "Ragionamento emotivo",
        description: "Trattare un'emozione come prova di una verità oggettiva.",
        frequency: 47,
        examples: ["“Mi sento inadeguata, quindi devo esserlo davvero.”"],
        trend: "up",
        evolution: "In aumento questa settimana.",
        confidence: "moderate",
        evidenceCount: 16,
        updatedAt: "3 giorni fa",
        sources: [
          { type: "chat", label: "Conversazioni recenti", date: "ultimi 7 gg" },
          { type: "journal", label: "Voce di diario · «Stanchezza»", date: "10 giu" },
        ],
      },
      {
        id: "cbt-over",
        name: "Generalizzazione eccessiva",
        description: "Trarre una conclusione assoluta da un singolo episodio.",
        frequency: 29,
        examples: ["“Va sempre così quando provo qualcosa di nuovo.”"],
        trend: "stable",
        evolution: "Frequenza costante.",
        confidence: "low",
        evidenceCount: 6,
        updatedAt: "1 settimana fa",
        sources: [{ type: "chat", label: "Conversazione del 1 giugno", date: "1 giu" }],
      },
      {
        id: "cbt-filter",
        name: "Filtro mentale",
        description: "Focalizzarsi sui dettagli negativi ignorando quelli positivi.",
        frequency: 38,
        examples: ["“La giornata è stata brutta perché ho dimenticato una mail.”"],
        trend: "down",
        evolution: "In miglioramento dall'inizio del mese.",
        confidence: "moderate",
        evidenceCount: 13,
        updatedAt: "4 giorni fa",
        sources: [
          { type: "journal", label: "Voci di diario · ultima settimana", date: "ultimi 7 gg" },
        ],
      },
      {
        id: "cbt-self",
        name: "Linguaggio auto-critico",
        description: "Uso ricorrente di parole severe rivolte a se stessi.",
        frequency: 52,
        examples: ["“Sono stupida.”", "“Non sono brava abbastanza.”"],
        trend: "down",
        evolution: "Diminuito del 22% nell'ultimo mese.",
        confidence: "high",
        evidenceCount: 31,
        updatedAt: "Ieri",
        sources: [
          { type: "chat", label: "Conversazioni · ultime 4 settimane", date: "ultimo mese" },
          { type: "behavior", label: "Auto-osservazioni nel diario", date: "ricorrente" },
        ],
      },
    ],
  },
  {
    id: "dbt",
    label: "Terapia Dialettico-Comportamentale",
    acronym: "DBT",
    description:
      "Quattro abilità fondamentali per vivere le emozioni intense e le relazioni con maggiore equilibrio.",
    icon: Heart,
    accent: "from-dust/20 to-dust/5",
    patterns: [
      {
        id: "dbt-reg",
        name: "Regolazione emotiva",
        description: "Capacità di riconoscere, dare nome e modulare l'intensità delle emozioni.",
        frequency: 68,
        examples: ["Riconosci e nomini l'emozione prima di agire."],
        trend: "up",
        evolution: "Punto di forza in crescita.",
        confidence: "high",
        evidenceCount: 24,
        updatedAt: "2 giorni fa",
        sources: [
          { type: "journal", label: "Diario emotivo · ultime 3 settimane", date: "ultimo mese" },
        ],
      },
      {
        id: "dbt-dist",
        name: "Tolleranza del disagio",
        description: "Restare presenti nelle situazioni difficili senza reagire impulsivamente.",
        frequency: 45,
        examples: ["“Ho aspettato prima di rispondere a quel messaggio.”"],
        trend: "stable",
        evolution: "Area in osservazione.",
        confidence: "moderate",
        evidenceCount: 12,
        updatedAt: "1 settimana fa",
        sources: [{ type: "chat", label: "Conversazione del 5 giugno", date: "5 giu" }],
      },
      {
        id: "dbt-int",
        name: "Efficacia interpersonale",
        description: "Chiedere ciò di cui hai bisogno e dire di no preservando la relazione.",
        frequency: 39,
        examples: ["Hai posto un limite in modo gentile la scorsa settimana."],
        trend: "up",
        evolution: "Area che richiede attenzione, in miglioramento.",
        confidence: "moderate",
        evidenceCount: 9,
        updatedAt: "6 giorni fa",
        sources: [
          { type: "journal", label: "Voce di diario · «Quel no»", date: "7 giu" },
        ],
      },
      {
        id: "dbt-mind",
        name: "Mindfulness",
        description: "Presenza intenzionale, senza giudizio, all'esperienza del momento.",
        frequency: 58,
        examples: ["Pratiche brevi di respiro descritte nel diario."],
        trend: "up",
        evolution: "Pratica più costante rispetto al mese scorso.",
        confidence: "high",
        evidenceCount: 19,
        updatedAt: "3 giorni fa",
        sources: [
          { type: "behavior", label: "Cattura pensieri · 14 occorrenze", date: "ultime 2 settimane" },
        ],
      },
    ],
  },
  {
    id: "act",
    label: "Terapia dell'Accettazione e dell'Impegno",
    acronym: "ACT",
    description:
      "Vivere in coerenza con i propri valori, anche quando le emozioni difficili sono presenti.",
    icon: Compass,
    accent: "from-secondary to-secondary/30",
    patterns: [
      {
        id: "act-val",
        name: "Consapevolezza dei valori",
        description: "Riconoscere ciò che conta davvero e usarlo come bussola.",
        frequency: 61,
        examples: ["Hai nominato “autenticità” e “cura” come valori centrali."],
        trend: "up",
        evolution: "In crescita costante.",
        confidence: "high",
        evidenceCount: 18,
        updatedAt: "4 giorni fa",
        sources: [
          { type: "questionnaire", label: "Esercizio sui valori · 2 giu", date: "2 giu" },
        ],
      },
      {
        id: "act-flex",
        name: "Flessibilità psicologica",
        description: "Adattare il comportamento al contesto restando fedeli ai propri valori.",
        frequency: 53,
        examples: ["Hai cambiato approccio quando il piano iniziale non funzionava."],
        trend: "up",
        evolution: "Tendenza positiva.",
        confidence: "moderate",
        evidenceCount: 14,
        updatedAt: "5 giorni fa",
        sources: [{ type: "chat", label: "Conversazione dell'8 giugno", date: "8 giu" }],
      },
      {
        id: "act-avoid",
        name: "Evitamento esperienziale",
        description: "Tendenza a evitare emozioni o situazioni scomode anche a un costo.",
        frequency: 44,
        examples: ["Rimandare conversazioni difficili."],
        trend: "down",
        evolution: "In riduzione rispetto al mese scorso.",
        confidence: "moderate",
        evidenceCount: 11,
        updatedAt: "1 settimana fa",
        sources: [
          { type: "journal", label: "Diario · «La telefonata rimandata»", date: "30 mag" },
        ],
      },
      {
        id: "act-fus",
        name: "Fusione cognitiva",
        description: "Identificarsi con i propri pensieri come se fossero verità assolute.",
        frequency: 37,
        examples: ["“Sono i miei pensieri.”"],
        trend: "stable",
        evolution: "Stabile.",
        confidence: "moderate",
        evidenceCount: 10,
        updatedAt: "1 settimana fa",
        sources: [{ type: "chat", label: "Conversazioni recenti", date: "ultimi 14 gg" }],
      },
      {
        id: "act-action",
        name: "Azioni di impegno",
        description: "Piccoli passi quotidiani allineati ai valori.",
        frequency: 56,
        examples: ["Hai dedicato tempo alla scrittura tre volte questa settimana."],
        trend: "up",
        evolution: "Costanza in crescita.",
        confidence: "high",
        evidenceCount: 22,
        updatedAt: "Ieri",
        sources: [
          { type: "behavior", label: "Abitudini registrate", date: "ultime 2 settimane" },
        ],
      },
    ],
  },
  {
    id: "adhd",
    label: "Cornice ADHD-informata",
    acronym: "ADHD",
    description:
      "Osservazioni educative su attenzione, funzioni esecutive ed energia, senza valore conclusivo sulla persona.",
    icon: Zap,
    accent: "from-dust/15 to-secondary/30",
    patterns: [
      {
        id: "adhd-att",
        name: "Regolazione dell'attenzione",
        description: "Capacità di dirigere e mantenere il focus nel tempo.",
        frequency: 49,
        examples: ["Sessioni di lavoro più lunghe nelle ore mattutine."],
        trend: "stable",
        evolution: "Stabile, con picchi nelle ore del mattino.",
        confidence: "moderate",
        evidenceCount: 15,
        updatedAt: "3 giorni fa",
        sources: [{ type: "behavior", label: "Pattern orari", date: "ultime 3 settimane" }],
      },
      {
        id: "adhd-exec",
        name: "Funzioni esecutive",
        description: "Pianificare, organizzare e sequenziare le attività.",
        frequency: 42,
        examples: ["Liste iniziate e non concluse."],
        trend: "up",
        evolution: "In lieve miglioramento.",
        confidence: "moderate",
        evidenceCount: 12,
        updatedAt: "5 giorni fa",
        sources: [{ type: "journal", label: "Diario · «Il piano della settimana»", date: "4 giu" }],
      },
      {
        id: "adhd-init",
        name: "Avvio del compito",
        description: "Difficoltà o facilità nel cominciare un'attività.",
        frequency: 55,
        examples: ["Procrastinazione su attività poco stimolanti."],
        trend: "stable",
        evolution: "Area da osservare.",
        confidence: "moderate",
        evidenceCount: 13,
        updatedAt: "4 giorni fa",
        sources: [{ type: "chat", label: "Conversazione del 6 giugno", date: "6 giu" }],
      },
      {
        id: "adhd-hyper",
        name: "Episodi di iperfocus",
        description: "Periodi di concentrazione molto intensa su un singolo compito.",
        frequency: 31,
        examples: ["3 ore di scrittura consecutive senza pause."],
        trend: "up",
        evolution: "Più frequenti questa settimana.",
        confidence: "low",
        evidenceCount: 5,
        updatedAt: "2 giorni fa",
        sources: [{ type: "behavior", label: "Sessioni registrate", date: "ultimi 7 gg" }],
      },
      {
        id: "adhd-time",
        name: "Percezione del tempo",
        description: "Stima soggettiva della durata delle attività.",
        frequency: 47,
        examples: ["“Pensavo fossero passati 20 minuti, era un'ora.”"],
        trend: "stable",
        evolution: "Stabile.",
        confidence: "moderate",
        evidenceCount: 9,
        updatedAt: "1 settimana fa",
        sources: [{ type: "journal", label: "Diario · riflessioni sul tempo", date: "ultimo mese" }],
      },
      {
        id: "adhd-emo",
        name: "Disregolazione emotiva",
        description: "Risposte emotive intense e di breve durata.",
        frequency: 36,
        examples: ["Frustrazione rapida durante interruzioni."],
        trend: "down",
        evolution: "Lieve riduzione.",
        confidence: "moderate",
        evidenceCount: 10,
        updatedAt: "6 giorni fa",
        sources: [{ type: "chat", label: "Conversazioni recenti", date: "ultime 2 settimane" }],
      },
      {
        id: "adhd-mot",
        name: "Pattern motivazionali",
        description: "Variazioni di energia e interesse legate al contesto.",
        frequency: 51,
        examples: ["Più energia su progetti creativi che amministrativi."],
        trend: "up",
        evolution: "In crescita su attività significative.",
        confidence: "moderate",
        evidenceCount: 14,
        updatedAt: "3 giorni fa",
        sources: [{ type: "behavior", label: "Pattern di attività", date: "ultimo mese" }],
      },
    ],
  },
  {
    id: "attachment",
    label: "Attaccamento e relazioni",
    acronym: "REL",
    description:
      "Ipotesi educative su come ti relazioni con gli altri e con i tuoi bisogni. Non sono etichette.",
    icon: Users,
    accent: "from-primary/10 to-dust/10",
    patterns: [
      {
        id: "rel-bound",
        name: "Confini",
        description: "Capacità di riconoscere e comunicare i propri limiti.",
        frequency: 48,
        examples: ["Hai espresso un limite con un collega la scorsa settimana."],
        trend: "up",
        evolution: "In crescita.",
        confidence: "moderate",
        evidenceCount: 11,
        updatedAt: "5 giorni fa",
        sources: [{ type: "journal", label: "Voce di diario · «Il limite»", date: "7 giu" }],
      },
      {
        id: "rel-com",
        name: "Stile comunicativo",
        description: "Modi ricorrenti di esprimere bisogni ed emozioni.",
        frequency: 60,
        examples: ["Comunicazione riflessiva, talvolta differita."],
        trend: "stable",
        evolution: "Stabile.",
        confidence: "moderate",
        evidenceCount: 17,
        updatedAt: "4 giorni fa",
        sources: [{ type: "chat", label: "Pattern conversazionali", date: "ultimo mese" }],
      },
      {
        id: "rel-conf",
        name: "Gestione del conflitto",
        description: "Strategie usate quando emerge un disaccordo.",
        frequency: 35,
        examples: ["Tendenza a riflettere prima di affrontare il tema."],
        trend: "up",
        evolution: "Maggior tolleranza al disaccordo.",
        confidence: "moderate",
        evidenceCount: 9,
        updatedAt: "1 settimana fa",
        sources: [{ type: "chat", label: "Conversazione del 1 giugno", date: "1 giu" }],
      },
      {
        id: "rel-reass",
        name: "Ricerca di rassicurazione",
        description: "Bisogno di conferma da parte degli altri.",
        frequency: 32,
        examples: ["“Pensi che abbia fatto bene?”"],
        trend: "down",
        evolution: "In diminuzione.",
        confidence: "moderate",
        evidenceCount: 8,
        updatedAt: "6 giorni fa",
        sources: [{ type: "chat", label: "Conversazioni recenti", date: "ultimi 14 gg" }],
      },
      {
        id: "rel-dep",
        name: "Dipendenza emotiva",
        description: "Intensità della centralità di una relazione nei propri stati d'animo.",
        frequency: 26,
        examples: [],
        trend: "stable",
        evolution: "Osservazione preliminare.",
        confidence: "low",
        evidenceCount: 4,
        updatedAt: "2 settimane fa",
        sources: [{ type: "journal", label: "Diario · maggio", date: "maggio" }],
      },
      {
        id: "rel-with",
        name: "Ritiro sociale",
        description: "Periodi di minore connessione con gli altri.",
        frequency: 29,
        examples: ["Settimane con meno interazioni registrate."],
        trend: "down",
        evolution: "In riduzione rispetto a maggio.",
        confidence: "low",
        evidenceCount: 6,
        updatedAt: "1 settimana fa",
        sources: [{ type: "behavior", label: "Frequenza di interazioni", date: "ultimo mese" }],
      },
    ],
  },
  {
    id: "trauma",
    label: "Lente trauma-informata",
    acronym: "TI",
    description:
      "Osservazioni rispettose, mai etichette. Non descriviamo nessuno come «traumatizzato»: solo schemi su cui riflettere.",
    icon: Shield,
    accent: "from-anthracite/10 to-anthracite/5",
    patterns: [
      {
        id: "ti-avoid",
        name: "Pattern di evitamento",
        description: "Tendenza ad allontanarsi da situazioni o ricordi associati a disagio.",
        frequency: 34,
        examples: ["Rimandare luoghi o conversazioni specifiche."],
        trend: "stable",
        evolution: "Stabile.",
        confidence: "low",
        evidenceCount: 7,
        updatedAt: "1 settimana fa",
        sources: [{ type: "journal", label: "Voci di diario · varie", date: "ultime 3 settimane" }],
      },
      {
        id: "ti-hyper",
        name: "Indicatori di ipervigilanza",
        description: "Stato di allerta prolungato in contesti percepiti come imprevedibili.",
        frequency: 28,
        examples: ["Difficoltà a rilassarti in ambienti nuovi."],
        trend: "down",
        evolution: "Indicatori in calo.",
        confidence: "low",
        evidenceCount: 5,
        updatedAt: "10 giorni fa",
        sources: [{ type: "chat", label: "Conversazione del 25 maggio", date: "25 mag" }],
      },
      {
        id: "ti-safe",
        name: "Comportamenti di ricerca di sicurezza",
        description: "Strategie per ridurre l'incertezza percepita.",
        frequency: 31,
        examples: ["Pianificare nei minimi dettagli prima di uscire."],
        trend: "stable",
        evolution: "Stabile.",
        confidence: "low",
        evidenceCount: 6,
        updatedAt: "1 settimana fa",
        sources: [{ type: "behavior", label: "Pattern di pianificazione", date: "ultimo mese" }],
      },
      {
        id: "ti-shut",
        name: "Chiusure emotive",
        description: "Momenti di distanziamento dalle proprie emozioni.",
        frequency: 22,
        examples: ["“Mi sentivo intorpidita.”"],
        trend: "down",
        evolution: "Meno frequenti rispetto a maggio.",
        confidence: "low",
        evidenceCount: 4,
        updatedAt: "2 settimane fa",
        sources: [{ type: "journal", label: "Diario · «Distanza»", date: "20 mag" }],
      },
    ],
  },
  {
    id: "strengths",
    label: "Sistema di rilevamento delle risorse",
    acronym: "FORZE",
    description: "Le tue qualità ricorrenti. Vengono valorizzate in tutta l'esperienza Hu-Mind.",
    icon: Sparkles,
    accent: "from-primary/20 to-primary/5",
    patterns: [
      {
        id: "s-res",
        name: "Resilienza",
        description: "Capacità di tornare in equilibrio dopo un momento difficile.",
        frequency: 74,
        examples: ["Dopo la settimana intensa, hai ritrovato il tuo ritmo."],
        trend: "up",
        evolution: "Confermata nelle ultime 6 settimane.",
        confidence: "high",
        evidenceCount: 28,
        updatedAt: "Ieri",
        sources: [{ type: "journal", label: "Pattern ricorrenti nel diario", date: "ultime 6 settimane" }],
      },
      {
        id: "s-cur",
        name: "Curiosità",
        description: "Apertura verso nuove idee, persone ed esperienze.",
        frequency: 69,
        examples: ["Domande aperte ricorrenti nelle conversazioni."],
        trend: "up",
        evolution: "In crescita.",
        confidence: "high",
        evidenceCount: 23,
        updatedAt: "2 giorni fa",
        sources: [{ type: "chat", label: "Conversazioni · ultimo mese", date: "ultimo mese" }],
      },
      {
        id: "s-aw",
        name: "Consapevolezza di sé",
        description: "Capacità di osservare i propri stati interni.",
        frequency: 78,
        examples: ["Riconoscimento dell'emozione prima di reagire."],
        trend: "up",
        evolution: "Risorsa centrale, in crescita continua.",
        confidence: "high",
        evidenceCount: 34,
        updatedAt: "Oggi",
        sources: [
          { type: "journal", label: "Voci di diario · ultime 4 settimane", date: "ultimo mese" },
          { type: "chat", label: "Conversazioni riflessive", date: "ultime 2 settimane" },
        ],
      },
      {
        id: "s-pers",
        name: "Perseveranza",
        description: "Continuità nell'impegno verso ciò che ha valore.",
        frequency: 61,
        examples: ["Sei tornata alla scrittura ogni settimana, anche brevemente."],
        trend: "stable",
        evolution: "Costante.",
        confidence: "moderate",
        evidenceCount: 17,
        updatedAt: "3 giorni fa",
        sources: [{ type: "behavior", label: "Abitudini registrate", date: "ultimo mese" }],
      },
      {
        id: "s-comp",
        name: "Compassione",
        description: "Cura verso gli altri e — sempre più — verso te stessa.",
        frequency: 66,
        examples: ["Linguaggio più gentile verso te stessa nelle ultime settimane."],
        trend: "up",
        evolution: "Auto-compassione in crescita.",
        confidence: "high",
        evidenceCount: 21,
        updatedAt: "2 giorni fa",
        sources: [{ type: "chat", label: "Conversazioni recenti", date: "ultime 3 settimane" }],
      },
      {
        id: "s-hon",
        name: "Onestà emotiva",
        description: "Riconoscere e dare nome a ciò che senti, anche quando è scomodo.",
        frequency: 71,
        examples: ["“Oggi ho paura, e va bene così.”"],
        trend: "up",
        evolution: "Risorsa solida.",
        confidence: "high",
        evidenceCount: 25,
        updatedAt: "Ieri",
        sources: [{ type: "journal", label: "Diario emotivo", date: "ultimo mese" }],
      },
      {
        id: "s-solve",
        name: "Problem solving",
        description: "Trovare soluzioni concrete in situazioni complesse.",
        frequency: 57,
        examples: ["Hai scomposto un problema grande in passi praticabili."],
        trend: "stable",
        evolution: "Stabile.",
        confidence: "moderate",
        evidenceCount: 14,
        updatedAt: "1 settimana fa",
        sources: [{ type: "chat", label: "Conversazione del 3 giugno", date: "3 giu" }],
      },
      {
        id: "s-adapt",
        name: "Adattabilità",
        description: "Flessibilità di fronte al cambiamento.",
        frequency: 63,
        examples: ["Hai accolto un imprevisto trasformandolo in opportunità."],
        trend: "up",
        evolution: "In crescita.",
        confidence: "moderate",
        evidenceCount: 18,
        updatedAt: "4 giorni fa",
        sources: [{ type: "journal", label: "Diario · «Cambio di piani»", date: "8 giu" }],
      },
    ],
  },
];

// ——— UI helpers ———

const CONFIDENCE_META: Record<Confidence, { label: string; dot: string; bar: string; pct: number }> = {
  low: { label: "Demo bassa", dot: "bg-muted-foreground/50", bar: "bg-muted-foreground/40", pct: 33 },
  moderate: { label: "Demo media", dot: "bg-dust", bar: "bg-dust", pct: 66 },
  high: { label: "Demo alta", dot: "bg-primary", bar: "bg-primary", pct: 100 },
};

const SOURCE_META: Record<Pattern["sources"][number]["type"], { label: string; icon: typeof MessageCircle }> = {
  chat: { label: "Conversazione", icon: MessageCircle },
  journal: { label: "Diario", icon: BookOpen },
  questionnaire: { label: "Questionario", icon: ClipboardList },
  behavior: { label: "Comportamento", icon: Activity },
};

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === "up") return <TrendingUp className="size-3.5 text-primary" />;
  if (trend === "down") return <TrendingDown className="size-3.5 text-primary" />;
  return <Minus className="size-3.5 text-muted-foreground" />;
}

function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const meta = CONFIDENCE_META[confidence];
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
      <span className={`size-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function FrequencyBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full bg-primary/70 transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

// ——— Page ———

function FrameworkPage() {
  const [active, setActive] = useState<DomainId>("cbt");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [excluded, setExcluded] = useState<Set<string>>(new Set());

  const current = DOMAINS.find((d) => d.id === active)!;
  const Icon = current.icon;

  return (
    <div className="px-6 md:px-10 py-10 md:py-14 max-w-6xl mx-auto pb-32">
      {/* Header */}
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-4">
          <BookMarked className="size-3.5" />
          Knowledge Framework
        </div>
        <h1 className="font-display text-4xl md:text-5xl leading-tight text-foreground mb-4">
          Le cornici scientifiche dietro le tue connessioni.
        </h1>
        <p className="text-foreground/70 max-w-2xl leading-relaxed">
          Hu-Mind organizza le osservazioni come lenti di lettura per la riflessione personale.
          Ogni pattern è un'ipotesi narrativa, mai un'etichetta.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Dati demo: frequenze, esempi e date in questa pagina sono contenuti illustrativi.
        </p>

        {/* Safety strip */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border/60 bg-secondary/40 px-4 py-3">
          <Info className="size-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-foreground/70 leading-relaxed">
            Nessuna osservazione è una conclusione su chi sei.
            Tutto ciò che vedi è materiale per consapevolezza, memoria narrativa e pensiero riflessivo.
          </p>
        </div>
      </header>

      {/* Domain tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-2 px-2 scrollbar-thin">
        {DOMAINS.map((d) => {
          const I = d.icon;
          const isActive = d.id === active;
          return (
            <button
              key={d.id}
              onClick={() => {
                setActive(d.id);
                setExpanded(null);
              }}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm transition-all border ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-soft"
                  : "bg-card text-foreground/70 border-border/60 hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <I className="size-4" />
              <span className="font-medium">{d.acronym}</span>
              <span className={`text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                · {d.label.split(" ").slice(0, 2).join(" ")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Domain header */}
      <section className={`rounded-3xl bg-gradient-to-br ${current.accent} border border-border/60 p-6 md:p-8 mb-8`}>
        <div className="flex items-start gap-4">
          <div className="size-12 rounded-2xl bg-card grid place-items-center shadow-soft shrink-0">
            <Icon className="size-5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              {current.acronym}
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">{current.label}</h2>
            <p className="text-foreground/70 leading-relaxed max-w-3xl">{current.description}</p>
          </div>
        </div>
      </section>

      {/* Patterns list */}
      <section className="space-y-4">
        {current.patterns.map((p) => {
          const isExpanded = expanded === p.id;
          const isExcluded = excluded.has(p.id);
          return (
            <article
              key={p.id}
              className={`rounded-2xl border border-border/60 bg-card transition-all overflow-hidden ${
                isExcluded ? "opacity-50" : ""
              }`}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : p.id)}
                className="w-full text-left p-5 md:p-6 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg md:text-xl text-foreground mb-1">{p.name}</h3>
                    <p className="text-sm text-foreground/70 leading-relaxed">{p.description}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs text-foreground/70 bg-secondary/60 rounded-full px-2.5 py-1">
                      <TrendIcon trend={p.trend} />
                      {p.trend === "up" ? "in crescita" : p.trend === "down" ? "in calo" : "stabile"}
                    </span>
                    {isExpanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                  </div>
                </div>

                <div className="grid md:grid-cols-[1fr_auto] gap-4 items-center">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Intensità demo</span>
                      <span className="text-xs text-foreground/70 font-medium">demo</span>
                    </div>
                    <FrequencyBar value={p.frequency} />
                  </div>
                  <ConfidenceBadge confidence={p.confidence} />
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border/60 px-5 md:px-6 py-6 bg-secondary/20 space-y-6">
                  {/* Evolution */}
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                      Esempio demo
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{p.evolution}</p>
                  </div>

                  {/* Examples */}
                  {p.examples.length > 0 && (
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                        Esempi illustrativi
                      </div>
                      <ul className="space-y-2">
                        {p.examples.map((ex, i) => (
                          <li
                            key={i}
                            className="text-sm text-foreground/80 italic leading-relaxed pl-4 border-l-2 border-primary/40"
                          >
                            {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* What informed this */}
                  <div className="rounded-xl bg-card border border-border/60 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Info className="size-3.5 text-primary" />
                      <span className="text-xs font-medium text-foreground">
                        Fonti demo mostrate come esempio
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {p.sources.map((s, i) => {
                        const SI = SOURCE_META[s.type].icon;
                        return (
                          <li key={i} className="flex items-center gap-2.5 text-sm text-foreground/75">
                            <SI className="size-3.5 text-muted-foreground shrink-0" />
                            <span className="flex-1 min-w-0 truncate">{s.label}</span>
                            <span className="text-[11px] text-muted-foreground shrink-0">{s.date}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground">
                    <span>
                      <span className="text-foreground/70 font-medium">{p.evidenceCount}</span> elementi demo
                    </span>
                    <span>Aggiornamento demo: <span className="text-foreground/70">{p.updatedAt}</span></span>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60">
                    <button
                      onClick={() => {
                        const next = new Set(excluded);
                        if (next.has(p.id)) next.delete(p.id);
                        else next.add(p.id);
                        setExcluded(next);
                      }}
                      className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-card border border-border/60 hover:bg-muted transition"
                    >
                      <EyeOff className="size-3.5" />
                      {isExcluded ? "Reincludi nell'analisi" : "Rimuovi dall'analisi"}
                    </button>
                    <button className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-card border border-border/60 hover:bg-muted transition">
                      <FileX className="size-3.5" />
                      Escludi dai report futuri
                    </button>
                    <button className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-card border border-border/60 hover:bg-muted transition">
                      <RefreshCw className="size-3.5" />
                      Ricalcola insight
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </section>

      {/* Footer disclaimer */}
      <footer className="mt-12 rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-start gap-3">
          <Shield className="size-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-display text-base text-foreground">Sicurezza e trasparenza</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Hu-Mind non formula conclusioni identitarie e non assegna etichette.
              Le osservazioni sono ipotesi riflessive per favorire consapevolezza e pattern recognition.
              Hai sempre il controllo: puoi escludere qualsiasi pattern, chiedere un ricalcolo
              o rimuovere ciò che non vuoi venga ricordato.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
