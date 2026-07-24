import { useState } from 'react';
import { X } from 'lucide-react';

type PermissionState = NotificationPermission | 'unsupported';

export default function NotificationBanner() {
  const [permission, setPermission] = useState<PermissionState>(
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
  );
  const [dismissed, setDismissed] = useState(false);

  if (permission !== 'default' || dismissed) return null;

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <p className="text-sm text-amber-800">期限が近いタスクの通知を受け取りますか？</p>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={requestPermission}
          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-600"
        >
          有効にする
        </button>
        <button
          onClick={() => setDismissed(true)}
          aria-label="閉じる"
          className="rounded-md p-1 text-amber-500 hover:bg-amber-100"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
