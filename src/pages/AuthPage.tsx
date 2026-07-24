import { FormEvent, useState } from 'react';
import { ListTodo } from 'lucide-react';
import type { AuthError } from '@supabase/supabase-js';

interface AuthPageProps {
  onSignIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  onSignUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
}

export default function AuthPage({ onSignIn, onSignUp }: AuthPageProps) {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setSubmitting(true);

    const { error: authError } =
      mode === 'signIn' ? await onSignIn(email, password) : await onSignUp(email, password);

    setSubmitting(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    if (mode === 'signUp') {
      setInfoMessage('確認メールを送信しました。メール内のリンクからアカウントを有効化してください。');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
            <ListTodo size={22} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Todo List</h1>
            <p className="text-sm text-slate-400">
              {mode === 'signIn' ? 'ログインしてください' : 'アカウントを作成'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード（6文字以上）"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          {infoMessage && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {infoMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-60"
          >
            {mode === 'signIn' ? 'ログイン' : 'アカウントを作成'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'signIn' ? 'signUp' : 'signIn');
            setError(null);
            setInfoMessage(null);
          }}
          className="mt-4 w-full text-center text-sm text-slate-400 hover:text-slate-600"
        >
          {mode === 'signIn' ? 'アカウントをお持ちでない方はこちら' : 'すでにアカウントをお持ちの方はこちら'}
        </button>
      </div>
    </div>
  );
}
