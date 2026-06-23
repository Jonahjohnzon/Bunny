"use client"

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Navbar from './MainPage/trendingThreads/components/Navbar';
import CategoryBlock from './MainPage/trendingThreads/components/CategoryBlock';
import ForumSidebar from './MainPage/trendingThreads/components/ForumSidebar';
import { CategoryService, ApiCategory } from './services/category-service';
import AnnouncementBoard from './MainPage/trendingThreads/components/AnnouncementBoard';

function CategoryBlockSkeleton() {
  return (
    <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#242528] overflow-hidden">
      {/* category header */}
      <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
        <div className="h-3.5 w-40 rounded bg-[#2d2e32] animate-pulse" />
      </div>

      {/* subforum rows */}
      <div className="divide-y divide-[rgba(255,255,255,0.06)]">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 rounded bg-[#2d2e32] animate-pulse shrink-0" />
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div className="h-3 w-1/3 rounded bg-[#2d2e32] animate-pulse" />
              <div className="h-2.5 w-2/3 rounded bg-[#2d2e32] animate-pulse" />
            </div>
            <div className="hidden sm:block w-12 h-2.5 rounded bg-[#2d2e32] animate-pulse shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ForumHome() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { data } = await CategoryService.list();
        if (cancelled) return;
        setCategories(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-[#1b1c1f] text-[#e4e6eb]">
      <Navbar />

      <main className=" max-w-8xl mx-auto px-4 py-3">
        
        {/* Page header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[#bababb] font-semibold text-sm mt-1">Browse all categories and subforums</p>
          </div>
        </div>

        <div className="flex gap-5">
          {/* Main — categories */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <AnnouncementBoard />
            {loading && (
              <>
                {[0, 1, 2].map(i => (
                  <CategoryBlockSkeleton key={i} />
                ))}
              </>
            )}

            {!loading && error && (
              <div className="flex items-center gap-2.5 px-4 py-3 bg-[#ef4444]/08 border border-[#ef4444]/20 rounded-lg">
                <AlertTriangle size={13} className="text-[#ef4444] shrink-0" />
                <p className="text-base text-[#ef4444]">{error}</p>
              </div>
            )}

            {!loading && !error && categories.length === 0 && (
              <p className="text-base text-[#4a4b50] text-center py-12">No categories yet.</p>
            )}

            {!loading && !error && categories.map(cat => (
              <CategoryBlock key={cat._id} category={cat} />
            ))}
          </div>

          {/* Sidebar — still on mock data, per scope decision */}
          <ForumSidebar />
        </div>
      </main>
    </div>
  );
}