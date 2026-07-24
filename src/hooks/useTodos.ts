import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Todo } from '@/types/todo';

interface TodoRow {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  due_date: string | null;
  tags: string[];
}

function mapRowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    createdAt: new Date(row.created_at).getTime(),
    dueDate: row.due_date ? new Date(row.due_date).getTime() : null,
    tags: row.tags ?? [],
  };
}

export function useTodos(userId: string) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      return;
    }
    setError(null);
    setTodos((data as TodoRow[]).map(mapRowToTodo));
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    refetch().finally(() => setLoading(false));
  }, [refetch]);

  const addTodo = async (title: string, dueDate: number | null = null, tags: string[] = []) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const { error: insertError } = await supabase
      .from('todos')
      .insert({
        user_id: userId,
        title: trimmed,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        tags,
      });
    if (insertError) {
      setError(insertError.message);
      return;
    }
    await refetch();
  };

  const toggleTodo = async (id: string) => {
    const target = todos.find((todo) => todo.id === id);
    if (!target) return;
    const { error: updateError } = await supabase
      .from('todos')
      .update({ completed: !target.completed })
      .eq('id', id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await refetch();
  };

  const deleteTodo = async (id: string) => {
    const { error: deleteError } = await supabase.from('todos').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    await refetch();
  };

  const editTodo = async (id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const { error: updateError } = await supabase
      .from('todos')
      .update({ title: trimmed })
      .eq('id', id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await refetch();
  };

  return { todos, loading, error, addTodo, toggleTodo, deleteTodo, editTodo };
}
