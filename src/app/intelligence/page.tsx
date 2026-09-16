"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IntelligencePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/report");
  }, [router]);

  return (
    <div className="max-w-md mx-auto py-20 text-center text-slate-500 text-sm">
      Redirecting to unified feasibility report...
    </div>
  );
}

