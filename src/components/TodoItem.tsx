import { useState } from 'react';
import { Check, Clock, Pencil, Trash2, X } from 'lucide-react';
import type { Todo } from '@/types/todo';
import { formatDueDate, getDueDateStatus } from '@/lib/dueDate';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

const DUE_DATE_BADGE_STYLES: Record<'overdue' | 'soon' | 'normal', string> = {
  overdue: 'bg-red-50 text-red-600',
  soon: 'bg-amber-50 text-amber-600',
  normal: 'bg-slate-100 text-slate-500',
};

const DUE_DATE_BADGE_LABELS: Record<'overdue' | 'soon' | 'normal', string> = {
  overdue: '期限切れ',
  soon: 'まもなく期限',
  normal: '',
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const dueDateStatus = getDueDateStatus(todo.dueDate, todo.completed);

  const commitEdit = () => {
    onEdit(todo.id, draft);
    setIsEditing(false);
  };

  return (
    <li className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:shadow-md">
      <button
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? '未完了に戻す' : '完了にする'}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
          todo.completed
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-300 text-transparent hover:border-emerald-400'
        }`}
      >
        <Check size={14} strokeWidth={3} />
      </button>

      {isEditing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitEdit();
            if (e.key === 'Escape') setIsEditing(false);
          }}
          onBlur={commitEdit}
          className="flex-1 rounded-md border border-slate-200 px-2 py-1 text-sm outline-none focus:border-emerald-400"
        />
      ) : (
        <div className="flex flex-1 flex-col gap-1">
          <span
            className={`text-sm ${
              todo.completed ? 'text-slate-400 line-through' : 'text-slate-700'
            }`}
          >
            {todo.title}
          </span>
          {dueDateStatus !== 'none' && todo.dueDate !== null && (
            <span
              className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs ${DUE_DATE_BADGE_STYLES[dueDateStatus]}`}
            >
              <Clock size={11} />
              {DUE_DATE_BADGE_LABELS[dueDateStatus]
                ? `${DUE_DATE_BADGE_LABELS[dueDateStatus]} · ${formatDueDate(todo.dueDate)}`
                : formatDueDate(todo.dueDate)}
            </span>
          )}
        </div>
      )}

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
        {isEditing ? (
          <button
            onClick={() => setIsEditing(false)}
            aria-label="編集をキャンセル"
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            aria-label="編集"
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <Pencil size={16} />
          </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          aria-label="削除"
          className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}
