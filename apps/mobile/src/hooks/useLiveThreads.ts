import { useEffect, useMemo, useState } from 'react';
import { chatService } from '@/src/services/chat.service';
import { Thread } from '@/src/types/chat.types';

export function useLiveThreads(pollMs = 10000) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = () => {
      chatService
        .listThreads()
        .then((items) => {
          if (!mounted) return;
          setThreads(items);
          setError(null);
        })
        .catch((value) => {
          if (!mounted) return;
          setError(value instanceof Error ? value : new Error('Could not load chats'));
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    };

    load();
    const interval = setInterval(load, pollMs);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [pollMs]);

  const stats = useMemo(() => {
    const unreadCount = threads.reduce(
      (total, thread) => total + thread.unreadCount,
      0,
    );
    const groupCount = threads.filter((thread) => thread.type === 'group').length;
    const directCount = threads.filter((thread) => thread.type === 'direct').length;
    const messageCount = threads.reduce(
      (total, thread) => total + (thread.lastMessage ? 1 : 0),
      0,
    );
    const memberCount = threads.reduce(
      (total, thread) => total + Math.max(thread.memberCount ?? 0, 0),
      0,
    );

    return {
      unreadCount,
      groupCount,
      directCount,
      messageCount,
      memberCount,
    };
  }, [threads]);

  return { threads, loading, error, ...stats };
}
