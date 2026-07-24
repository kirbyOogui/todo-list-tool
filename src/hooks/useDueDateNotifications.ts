import { useEffect, useRef } from 'react';
import type { Todo } from '@/types/todo';
import { DUE_SOON_THRESHOLD_MS } from '@/lib/dueDate';

export function useDueDateNotifications(todos: Todo[]): void {
  const notifiedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

    const checkDueDates = () => {
      const liveIds = new Set(todos.map((todo) => todo.id));
      for (const id of notifiedIdsRef.current) {
        if (!liveIds.has(id)) notifiedIdsRef.current.delete(id);
      }

      const now = Date.now();
      for (const todo of todos) {
        if (
          todo.completed ||
          todo.dueDate === null ||
          notifiedIdsRef.current.has(todo.id) ||
          todo.dueDate - now > DUE_SOON_THRESHOLD_MS
        ) {
          continue;
        }
        new Notification('タスクの期限が近づいています', { body: todo.title, tag: todo.id });
        notifiedIdsRef.current.add(todo.id);
      }
    };

    checkDueDates();
    const intervalId = setInterval(checkDueDates, 60_000);
    return () => clearInterval(intervalId);
  }, [todos]);
}
