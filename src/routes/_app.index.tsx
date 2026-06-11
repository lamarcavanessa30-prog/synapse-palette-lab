import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, MessageCircle, Network, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_app/")({
  component: HomePage,
});

const recent = [
  { tag: "Riflessione", text: "Forse la creatività è solo memoria che impara a danzare.", time: "2 ore fa", color: "bg-secondary" },
  { tag: "Lettura", text: "«Camminare è il modo in cui il corpo pensa.» — Rebecca Solnit", time: "Ieri", color: "bg-accent/40" },
  { tag: "Idea", text: "Progettare un rituale di scrittura serale, 7 minuti, senza schermo.", time: "Ieri", color: "bg-muted" },
];

const constellations = [
  { name: "Architettura interiore", count: 24, hue: "from-sage to-sage-deep" },
  { name: "Letture lente", count: 17, hue: "from-dust to-sage" },
  { name: "Rituali quotidiani", count: 11, hue: "from-anthracite to-sage-deep" },
];

function HomePage() {
  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto pb-32">
      {/* Header */}
      <header className="mb-12">
        <div className="text-sm text-muted-foreground">Giovedì, 11 Giugno</div>
        <h1 className="font-display text-4xl md:text-6xl mt-2 leading-[1.05]">
          Buongiorno, Elena.<br />
          <span className="text-primary italic">La tua mente</span> ha 142 connessioni.
        </h1>
        <p className="mt-5 text-muted-foreground max-w-xl leading-relaxed">
          Tre nuovi pensieri attendono di essere coltivati. La costellazione "Architettura interiore" è cresciuta di sei nodi questa settimana.
        </p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        {[
          { k: "142", l: "pensieri", sub: "+8 questa sett." },
          { k: "23", l: "costellazioni", sub: "3 in crescita" },
          { k: "47", l: "giorni di pratica", sub: "serie attiva" },
          { k: "9.2", l: "indice di chiarezza", sub: "↑ 0.4" },
        ].map((s) => (
          <div key={s.l} className="glass rounded-2xl p-5 shadow-soft">
            <div className="font-display text-3xl">{s.k}</div>
            <div className="text-sm text-foreground/70 mt-1 capitalize">{s.l}</div>
            <div className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1"><TrendingUp className="size-3" />{s.sub}</div>
          </div>
        ))}
      </section>

      {/* Quick lanes */}
      <section className="grid md:grid-cols-3 gap-4 mb-12">
        {[
          { to: "/chat", icon: MessageCircle, title: "Dialoga", desc: "Apri una conversazione con il tuo sé pensante." },
          { to: "/mappa", icon: Network, title: "Esplora la mappa", desc: "Vedi come le idee si intrecciano nel tempo." },
          { to: "/diario", icon: BookOpen, title: "Apri il diario", desc: "Sfoglia i tuoi pensieri, giorno per giorno." },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="group relative overflow-hidden rounded-2xl p-6 bg-card border border-border/60 shadow-soft hover:shadow-float hover:-translate-y-0.5 transition-all">
            <c.icon className="size-5 text-primary mb-8" />
            <div className="font-display text-2xl">{c.title}</div>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{c.desc}</p>
            <ArrowUpRight className="size-4 absolute top-6 right-6 text-muted-foreground group-hover:text-primary group-hover:rotate-12 transition" />
          </Link>
        ))}
      </section>

      {/* Two columns */}
      <div className="grid md:grid-cols-5 gap-6">
        <section className="md:col-span-3">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display text-2xl">Pensieri recenti</h2>
            <Link to="/diario" className="text-xs text-muted-foreground hover:text-primary">Tutti →</Link>
          </div>
          <div className="space-y-3">
            {recent.map((r, i) => (
              <article key={i} className={`group rounded-2xl p-5 border border-border/60 ${r.color} hover:shadow-soft transition`}>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {r.tag} · {r.time}
                </div>
                <p className="font-display text-lg leading-snug">{r.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="md:col-span-2">
          <h2 className="font-display text-2xl mb-4">Costellazioni</h2>
          <div className="space-y-3">
            {constellations.map((c) => (
              <div key={c.name} className="rounded-2xl p-5 bg-card border border-border/60 shadow-soft">
                <div className={`size-10 rounded-xl bg-gradient-to-br ${c.hue} mb-3 shadow-soft`} />
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.count} nodi connessi</div>
              </div>
            ))}
            <div className="rounded-2xl p-5 border border-dashed border-border bg-transparent text-sm text-muted-foreground flex items-center gap-2">
              <Sparkles className="size-4" /> Lascia che una nuova costellazione si formi.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
