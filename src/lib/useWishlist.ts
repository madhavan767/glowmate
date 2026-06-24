import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import { toast } from "sonner";

export function useWishlist() {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setIds([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase.from("wishlist").select("artist_id").eq("user_id", user.id);
    setIds((data ?? []).map((r) => r.artist_id));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (artistId: string) => {
      if (!user) {
        toast.error("Please sign in to save artists to your wishlist.");
        return false;
      }
      if (ids.includes(artistId)) {
        await supabase.from("wishlist").delete().eq("user_id", user.id).eq("artist_id", artistId);
        setIds((p) => p.filter((i) => i !== artistId));
        toast("Removed from wishlist");
        return false;
      }
      await supabase.from("wishlist").insert({ user_id: user.id, artist_id: artistId });
      setIds((p) => [...p, artistId]);
      toast.success("Added to wishlist 💖");
      return true;
    },
    [user, ids],
  );

  return { ids, loading, toggle, refresh, has: (id: string) => ids.includes(id) };
}
