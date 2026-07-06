import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Search, BookOpen } from "lucide-react";
import { useThoughts } from "@/domain/ThoughtsProvider";
import type { Thought } from "@/domain/thoughts";

export const Route = createFileRoute("/_app/diario")({
  component: DiarioPage,
});

function DiarioPage() {
  const [view, setView] = useState<"timeline" | "calendar">("timeline");
  const [query, setQuery] = useState("");
  const { thoughts } = useThoughts();
  const filteredThoughts = thoughts.filter((thought) =>
    thought.text.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const entries = groupThoughtsByDay(filteredThoughts);
  const activeDays = new Set(thoughts.map((thought) => new Date(thought.createdAt).getDate()));
  const today = new Date().getDate();

  return (
    <div className="px-6 md:px-12 py-8 max-w-5xl mx-auto pb-32">
      <header className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Diario</div>
          <h1 className="font-display text-4xl md:text-5xl mt-2">La cronaca dei tuoi pensieri</h1>
          <p className="text-muted-foreground mt-2">{thoughts.length} pensieri conservati · memoria locale attiva</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cerca…"
              className="bg-card border border-border/60 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30 w-56"
            />
          </div>
          <div className="flex rounded-lg bg-card border border-border/60 p-0.5">
            <button onClick={() => setView("timeline")} className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-2 ${view === "timeline" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              <BookOpen className="size-4" /> Timeline
            </button>
            <button onClick={() => setView("calendar")} className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-2 ${view === "calendar" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              <Calendar className="size-4" /> Calendario
            </button>
          </div>
        </div>
      </header>

      {view === "timeline" ? (
        <div className="relative">
          <div className="absolute left-[14px] md:left-[28px] top-2 bottom-2 w-px bg-border" />
          <div className="space-y-10">
            {entries.length > 0 ? entries.map((group) => (
              <section key={group.date} className="relative pl-12 md:pl-20">
                <div className="absolute left-0 top-0 flex flex-col items-center">
                  <div className="size-8 md:size-14 rounded-full bg-primary text-primary-foreground grid place-items-center font-display text-sm md:text-lg shadow-soft">
                    {group.day}
                  </div>
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{group.date}</div>
                <div className="space-y-3">
                  {group.items.map((it) => (
                    <article key={it.id} className="rounded-2xl bg-card border border-border/60 p-6 shadow-soft hover:shadow-float transition-all">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                        <span className="size-1.5 rounded-full bg-primary" />
                        {it.tag} · {it.time}
                      </div>
                      <p className="font-display text-xl leading-relaxed">{it.text}</p>
                      {it.links.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {it.links.map((l) => (
                            <span key={l} className="text-xs px-3 py-1 rounded-full bg-secondary/70 text-secondary-foreground border border-border/60">
                              ↳ {l}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )) : (
              <section className="relative pl-12 md:pl-20">
                <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-soft">
                  <p className="font-display text-xl leading-relaxed">Nessun pensiero trovato.</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    I pensieri che conservi compariranno qui e resteranno disponibili dopo il refresh.
                  </p>
                </div>
              </section>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {["L", "M", "M", "G", "V", "S", "D"].map((d, i) => (
            <div key={i} className="text-center text-[11px] uppercase tracking-widest text-muted-foreground py-2">{d}</div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => {
            const day = i - 2;
            const has = activeDays.has(day);
            const isToday = day === today;
            return (
              <div
                key={i}
                className={`aspect-square rounded-xl border p-2 flex flex-col justify-between ${
                  isToday ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/60"
                } ${day < 1 || day > 30 ? "opacity-30" : ""}`}
              >
                <div className="text-xs">{day >= 1 && day <= 30 ? day : ""}</div>
                {has && day >= 1 && day <= 30 && (
                  <div className="flex gap-1">
                    <span className={`size-1.5 rounded-full ${isToday ? "bg-primary-foreground" : "bg-primary"}`} />
                    <span className={`size-1.5 rounded-full ${isToday ? "bg-primary-foreground/60" : "bg-accent"}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function groupThoughtsByDay(thoughts: Thought[]) {
  const groups = new Map<string, { date: string; day: string; items: Array<{ id: string; tag: string; time: string; text: string; links: string[] }> }>();

  thoughts.forEach((thought) => {
    const date = new Date(thought.createdAt);
    const key = date.toDateString();
    const existing = groups.get(key);
    const group = existing ?? {
      date: new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long" }).format(date),
      day: new Intl.DateTimeFormat("it-IT", { day: "2-digit" }).format(date),
      items: [],
    };

    group.items.push({
      id: thought.id,
      tag: thought.tags[0] ?? sourceLabel(thought.source),
      time: new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit" }).format(date),
      text: thought.text,
      links: thought.tags.slice(1),
    });

    groups.set(key, group);
  });

  return Array.from(groups.values());
}

function sourceLabel(source: Thought["source"]) {
  if (source === "chat") return "Conversazione";
  if (source === "capture") return "Riflessione";
  return "Import";
}
