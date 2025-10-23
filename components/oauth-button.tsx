"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Provider } from "@supabase/supabase-js";

export function OAuthButton({
  className,
  provider,
}: React.ComponentPropsWithoutRef<"div"> & {
  provider: Provider;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSocialLogin} className="mb-2">
      <div className="flex flex-col gap-6">
        {error && <p className="text-sm text-destructive-500">{error}</p>}
        <Button variant="outline" type="submit" className="w-full cursor-pointer" disabled={isLoading}>
          {isLoading ? "Logging in..." : `Continue with ${provider}`}
        </Button>
      </div>
    </form>
  );
}
