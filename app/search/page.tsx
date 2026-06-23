// app/search/page.tsx
import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1b1c1f] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#4b8ef1] border-t-transparent animate-spin" />
      </div>
    }>
      <SearchPageClient />
    </Suspense>
  );
}