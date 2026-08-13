import { useCallback, useEffect, useRef, useState } from "react";
import {
  getFeedPosts,
  likeFeedPost,
  commentFeedPost,
  shareFeedPost,
  FeedPost,
  FeedComment,
} from "../api/feedApi";
import { useApp } from "../context/AppContext";

const POLL_INTERVAL = 8000;

/**
 * 🌐 Unified feed hook — polls the shared /api/feed every ~8s (the chosen
 * "real-time" strategy) and mutates optimistically so likes/comments/shares
 * feel instant even while the server is offline.
 */
export function useFeed() {
  const { currentUser } = useApp();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const myId = currentUser?.id || "user_demo_001";

  const load = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true);
    try {
      const next = await getFeedPosts();
      setPosts(next);
    } catch {
      /* keep last good posts */
    } finally {
      if (quiet) setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    timer.current = setInterval(() => load(true), POLL_INTERVAL);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [load]);

  const refresh = useCallback(() => load(true), [load]);

  const toggleLike = useCallback(
    async (id: string) => {
      const liked = posts.find((p) => p.id === id)?.likes?.includes(myId) ?? false;
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                likes: liked ? p.likes.filter((u) => u !== myId) : [...p.likes, myId],
                likeCount: Math.max(0, p.likeCount + (liked ? -1 : 1)),
              }
            : p
        )
      );
      try {
        const res = await likeFeedPost(id);
        setPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  likes: res.liked ? [...new Set([...p.likes, myId])] : p.likes.filter((u) => u !== myId),
                  likeCount: res.likeCount,
                }
              : p
          )
        );
      } catch {
        /* optimistic state already reflects the action */
      }
    },
    [posts, myId]
  );

  const addComment = useCallback(
    async (id: string, text: string) => {
      const user = currentUser?.name || "You";
      const optimistic: FeedComment = {
        id: `c_opt_${Date.now()}`,
        userId: myId,
        userName: user,
        avatar: "🙂",
        text,
        time: "now",
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, comments: [...p.comments, optimistic] } : p))
      );
      try {
        const saved = await commentFeedPost(id, text, user);
        setPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  comments: p.comments.map((c) => (c.id === optimistic.id ? saved : c)),
                }
              : p
          )
        );
      } catch {
        /* optimistic comment stays */
      }
    },
    [currentUser, myId]
  );

  const share = useCallback(
    async (id: string) => {
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, shares: p.shares + 1 } : p)));
      try {
        const res = await shareFeedPost(id);
        if (res.shares) {
          setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, shares: res.shares } : p)));
        }
      } catch {
        /* optimistic count stays */
      }
    },
    []
  );

  return { posts, loading, refreshing, refresh, toggleLike, addComment, share };
}
