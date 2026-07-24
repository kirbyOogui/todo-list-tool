export const DUE_SOON_THRESHOLD_MS = 24 * 60 * 60 * 1000;

export type DueDateStatus = 'none' | 'overdue' | 'soon' | 'normal';

export function getDueDateStatus(
  dueDate: number | null,
  completed: boolean,
  now: number = Date.now()
): DueDateStatus {
  if (dueDate === null) return 'none';
  if (completed) return 'normal';
  if (dueDate < now) return 'overdue';
  if (dueDate - now <= DUE_SOON_THRESHOLD_MS) return 'soon';
  return 'normal';
}

export function formatDueDate(dueDate: number): string {
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dueDate);
}
