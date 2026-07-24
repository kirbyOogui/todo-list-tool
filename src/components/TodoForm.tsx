import { FormEvent, KeyboardEvent, useState } from 'react';
import { Plus, Tag, X } from 'lucide-react';

interface TodoFormProps {
  onAdd: (title: string, dueDate: number | null, tags: string[]) => void;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const addTag = (raw: string) => {
    const normalized = raw.trim().replace(/,+$/, '');
    if (!normalized) return;
    const parts = normalized.split(',').map((t) => t.trim()).filter(Boolean);
    setTags((prev) => {
      const next = [...prev];
      for (const p of parts) {
        if (!next.includes(p)) next.push(p);
      }
      return next;
    });
    setTagInput('');
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (tagInput.trim()) addTag(tagInput);
    onAdd(title, dueDate ? new Date(dueDate).getTime() : null, tags);
    setTitle('');
    setDueDate('');
    setTagInput('');
    setTags([]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しいタスクを入力..."
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
      />

      {/* Tag chip input */}
      <div className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
        <Tag size={14} className="shrink-0 text-slate-400" />
        {tags.map((tag) => (
          <TagChip key={tag} tag={tag} onRemove={removeTag} />
        ))}
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          onBlur={() => addTag(tagInput)}
          placeholder={tags.length === 0 ? 'タグを追加（Enterまたは,で確定）' : ''}
          className="min-w-[120px] flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="flex gap-2">
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500 shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600 active:bg-emerald-700"
        >
          <Plus size={16} />
          追加
        </button>
      </div>
    </form>
  );
}

function TagChip({ tag, onRemove }: { tag: string; onRemove: (tag: string) => void }) {
  const { bg, text } = tagColor(tag);
  return (
    <span
      className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: bg, color: text }}
    >
      {tag}
      <button
        type="button"
        onClick={() => onRemove(tag)}
        className="flex items-center opacity-60 hover:opacity-100"
        aria-label={`${tag}を削除`}
      >
        <X size={10} strokeWidth={2.5} />
      </button>
    </span>
  );
}

export function tagColor(tag: string): { bg: string; text: string } {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) & 0xffffffff;
  }
  const hue = Math.abs(hash) % 360;
  return {
    bg: `hsl(${hue},70%,90%)`,
    text: `hsl(${hue},60%,30%)`,
  };
}
