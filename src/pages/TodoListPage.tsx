import { useMemo, useState } from 'react';
import { ListTodo, LogOut } from 'lucide-react';
import { useTodos } from '@/hooks/useTodos';
import { useDueDateNotifications } from '@/hooks/useDueDateNotifications';
import TodoForm from '@/components/TodoForm';
import TodoItem from '@/components/TodoItem';
import NotificationBanner from '@/components/NotificationBanner';
import { tagColor } from '@/components/TodoForm';

type Filter = 'all' | 'active' | 'completed';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'active', label: '未完了' },
  { key: 'completed', label: '完了' },
];

interface TodoListPageProps {
  userId: string;
  userEmail: string | null;
  onSignOut: () => Promise<void>;
}

export default function TodoListPage({ userId, userEmail, onSignOut }: TodoListPageProps) {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo } = useTodos(userId);
  const [filter, setFilter] = useState<Filter>('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useDueDateNotifications(todos);

  const allTags = useMemo(() => {
    const seen = new Set<string>();
    for (const todo of todos) {
      for (const tag of todo.tags) seen.add(tag);
    }
    return Array.from(seen).sort();
  }, [todos]);

  const filteredTodos = useMemo(() => {
    let list = todos;
    switch (filter) {
      case 'active':
        list = list.filter((t) => !t.completed);
        break;
      case 'completed':
        list = list.filter((t) => t.completed);
        break;
    }
    if (activeTag) list = list.filter((t) => t.tags.includes(activeTag));
    return list;
  }, [todos, filter, activeTag]);

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
              <ListTodo size={22} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">Todo List</h1>
              <p className="text-sm text-slate-400">
                {remaining > 0 ? `${remaining}件の未完了タスク` : 'すべて完了しました'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {userEmail && <span className="hidden text-xs text-slate-400 sm:inline">{userEmail}</span>}
            <button
              onClick={() => onSignOut()}
              aria-label="サインアウト"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <NotificationBanner />

        <div className="mb-6">
          <TodoForm onAdd={addTodo} />
        </div>

        <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-1 rounded-md py-1.5 text-sm font-medium transition ${
                filter === key
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {allTags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTag(null)}
              className={`rounded-full border px-3 py-0.5 text-xs font-medium transition ${
                activeTag === null
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              }`}
            >
              すべて
            </button>
            {allTags.map((tag) => {
              const { bg, text } = tagColor(tag);
              const isActive = activeTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(isActive ? null : tag)}
                  className="rounded-full px-3 py-0.5 text-xs font-medium transition"
                  style={
                    isActive
                      ? { backgroundColor: bg, color: text, outline: `2px solid ${text}`, outlineOffset: '1px' }
                      : { backgroundColor: bg, color: text, opacity: 0.65 }
                  }
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}

        {filteredTodos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
            タスクがありません
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
