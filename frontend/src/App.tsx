import { useState } from 'react';
import { Lightbulb, Plus, Pencil, Trash2, X, Check, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// ─── Types ────────────────────────────────────────────────────────────────────

interface IdeaCard {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
  color: 'amber' | 'coral' | 'teal' | 'violet';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

const COLOR_OPTIONS: IdeaCard['color'][] = ['amber', 'coral', 'teal', 'violet'];

const COLOR_STYLES: Record<IdeaCard['color'], { badge: string; dot: string; ring: string }> = {
  amber: {
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400',
    ring: 'ring-amber-500/40',
  },
  coral: {
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    dot: 'bg-rose-400',
    ring: 'ring-rose-500/40',
  },
  teal: {
    badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    dot: 'bg-teal-400',
    ring: 'ring-teal-500/40',
  },
  violet: {
    badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    dot: 'bg-violet-400',
    ring: 'ring-violet-500/40',
  },
};

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_IDEAS: IdeaCard[] = [
  {
    id: 'seed-1',
    title: 'Build a habit tracker',
    body: 'Create a minimal daily habit tracker with streaks, reminders, and a weekly heatmap view.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    color: 'amber',
  },
  {
    id: 'seed-2',
    title: 'Weekend reading list',
    body: 'Finish "Atomic Habits", start "Deep Work", and revisit the React docs on concurrent features.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    color: 'teal',
  },
  {
    id: 'seed-3',
    title: 'Side project: recipe app',
    body: 'An app that suggests recipes based on ingredients you already have at home. Use AI for smart matching.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    color: 'coral',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface IdeaFormProps {
  initial?: Partial<IdeaCard>;
  onSave: (title: string, body: string, color: IdeaCard['color']) => void;
  onCancel: () => void;
}

function IdeaForm({ initial, onSave, onCancel }: IdeaFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');
  const [color, setColor] = useState<IdeaCard['color']>(initial?.color ?? 'amber');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim(), body.trim(), color);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Title
        </label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's the idea?"
          className="w-full rounded-lg border border-border bg-secondary/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Details
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Describe it a bit more…"
          rows={4}
          className="w-full resize-none rounded-lg border border-border bg-secondary/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Color tag
        </label>
        <div className="flex gap-2">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-7 w-7 rounded-full transition ring-offset-2 ring-offset-card ${COLOR_STYLES[c].dot} ${color === c ? `ring-2 ${COLOR_STYLES[c].ring}` : 'opacity-50 hover:opacity-80'}`}
              aria-label={c}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          <X className="mr-1.5 h-3.5 w-3.5" /> Cancel
        </Button>
        <Button type="submit" size="sm" disabled={!title.trim()}>
          <Check className="mr-1.5 h-3.5 w-3.5" /> Save idea
        </Button>
      </div>
    </form>
  );
}

interface IdeaCardItemProps {
  idea: IdeaCard;
  onEdit: (idea: IdeaCard) => void;
  onDelete: (id: string) => void;
}

function IdeaCardItem({ idea, onEdit, onDelete }: IdeaCardItemProps) {
  const styles = COLOR_STYLES[idea.color];

  return (
    <Card className="card-hover group relative overflow-hidden border border-border/60 bg-card shadow-card">
      {/* Accent stripe */}
      <div className={`absolute left-0 top-0 h-full w-1 ${styles.dot}`} />

      <CardHeader className="pb-2 pl-5">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="font-display text-base font-semibold leading-snug text-card-foreground">
            {idea.title}
          </CardTitle>
          <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => onEdit(idea)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition"
              aria-label="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete(idea.id)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition"
              aria-label="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          {formatDate(idea.createdAt)}
        </CardDescription>
      </CardHeader>

      {idea.body && (
        <CardContent className="pl-5 pt-0">
          <p className="text-sm leading-relaxed text-card-foreground/80">{idea.body}</p>
        </CardContent>
      )}

      <div className="px-5 pb-3 pt-2">
        <Badge className={`text-[10px] font-semibold uppercase tracking-wider border ${styles.badge}`}>
          {idea.color}
        </Badge>
      </div>
    </Card>
  );
}

// ─── PhoneStorm Banner ────────────────────────────────────────────────────────

function PhoneStormBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border/40 shadow-card">
      {/* Subtle dark overlay gradient for text legibility if needed */}
      <img
        src="/assets/generated/phonestorm-banner.dim_1024x1024.png"
        alt="PhoneStorm – Free Phones Daily! Browse Models and Enter Giveaways"
        className="w-full object-cover"
        style={{ maxHeight: '420px', objectPosition: 'center' }}
      />
      {/* Bottom label strip */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span className="font-display text-sm font-bold tracking-wide text-white">
            Featured Partner
          </span>
        </div>
        <Badge className="border-amber-400/40 bg-amber-400/20 text-amber-200 text-xs font-semibold">
          PhoneStorm
        </Badge>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

type ModalState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; idea: IdeaCard };

export default function App() {
  const [ideas, setIdeas] = useState<IdeaCard[]>(SEED_IDEAS);
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCreate = (title: string, body: string, color: IdeaCard['color']) => {
    const newIdea: IdeaCard = {
      id: generateId(),
      title,
      body,
      createdAt: new Date(),
      color,
    };
    setIdeas((prev) => [newIdea, ...prev]);
    setModal({ mode: 'closed' });
  };

  const handleEdit = (title: string, body: string, color: IdeaCard['color']) => {
    if (modal.mode !== 'edit') return;
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === modal.idea.id ? { ...idea, title, body, color } : idea
      )
    );
    setModal({ mode: 'closed' });
  };

  const handleDelete = (id: string) => {
    setIdeas((prev) => prev.filter((idea) => idea.id !== id));
  };

  const isModalOpen = modal.mode !== 'closed';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/spark-logo.dim_128x128.png"
              alt="Spark Board logo"
              className="h-8 w-8 rounded-lg object-cover"
            />
            <div>
              <h1 className="font-display text-lg font-bold leading-none text-gradient-amber">
                Spark Board
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-wide">Ideas &amp; Notes</p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setModal({ mode: 'create' })}
            className="gap-1.5 font-semibold"
          >
            <Plus className="h-4 w-4" />
            New Idea
          </Button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        {/* PhoneStorm Banner */}
        <section className="mb-8 animate-fade-in">
          <PhoneStormBanner />
        </section>

        <Separator className="mb-8 opacity-30" />

        {/* Ideas Board */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-bold">My Ideas</h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {ideas.length} {ideas.length === 1 ? 'idea' : 'ideas'}
            </span>
          </div>

          {ideas.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-20 text-center">
              <Lightbulb className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-display text-lg font-semibold text-muted-foreground">No ideas yet</p>
              <p className="mt-1 text-sm text-muted-foreground/60">
                Hit <strong>New Idea</strong> to capture your first spark!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ideas.map((idea) => (
                <div key={idea.id} className="animate-fade-in">
                  <IdeaCardItem
                    idea={idea}
                    onEdit={(i) => setModal({ mode: 'edit', idea: i })}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40 bg-card/50 py-5">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-1 px-4 text-center sm:px-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Spark Board. Built with{' '}
            <Heart className="inline h-3 w-3 fill-rose-400 text-rose-400" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'spark-board')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* ── Modal Overlay ── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal({ mode: 'closed' });
          }}
        >
          <div className="w-full max-w-md animate-fade-in rounded-2xl border border-border/60 bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-bold">
                {modal.mode === 'create' ? 'New Idea' : 'Edit Idea'}
              </h2>
            </div>
            <IdeaForm
              initial={modal.mode === 'edit' ? modal.idea : undefined}
              onSave={modal.mode === 'create' ? handleCreate : handleEdit}
              onCancel={() => setModal({ mode: 'closed' })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
