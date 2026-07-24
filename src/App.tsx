import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/pages/AuthPage';
import TodoListPage from '@/pages/TodoListPage';

export default function App() {
  const { session, loading, signIn, signUp, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-400">読み込み中...</p>
      </div>
    );
  }

  if (!session) {
    return <AuthPage onSignIn={signIn} onSignUp={signUp} />;
  }

  return (
    <TodoListPage
      userId={session.user.id}
      userEmail={session.user.email ?? null}
      onSignOut={signOut}
    />
  );
}
