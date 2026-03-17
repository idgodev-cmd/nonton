"use client";

import { useKomikRecommended, useKomikLatest, useKomikPopular } from "@/hooks/useKomik";
import { UnifiedMediaCard } from "./UnifiedMediaCard";
import { UnifiedErrorDisplay } from "./UnifiedErrorDisplay";
import { UnifiedMediaCardSkeleton } from "./UnifiedMediaCardSkeleton";

export function KomikHome() {
  const { 
    data: recommendedData, 
    isLoading: loadingRecommended, 
    error: errorRecommended, 
    refetch: refetchRecommended 
  } = useKomikRecommended();
  
  const { 
    data: latestData, 
    isLoading: loadingLatest, 
    error: errorLatest, 
    refetch: refetchLatest 
  } = useKomikLatest();

  const {
      data: popularData,
      isLoading: loadingPopular,
      error: errorPopular,
      refetch: refetchPopular
  } = useKomikPopular();

  const isLoading = loadingRecommended || loadingLatest || loadingPopular;

  if (isLoading) {
    return (
      <div className="space-y-10">
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <div key={sectionIndex}>
            <div className="h-7 w-48 bg-muted/50 rounded animate-pulse mb-4" />
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
              {Array.from({ length: 12 }).map((_, cardIndex) => (
                <UnifiedMediaCardSkeleton key={cardIndex} index={cardIndex} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (errorRecommended || errorLatest || errorPopular) {
    return (
      <UnifiedErrorDisplay 
        title="Gagal Memuat Komik"
        message="Tidak dapat terhubung ke layanan Komik."
        onRetry={() => {
            refetchRecommended();
            refetchLatest();
            refetchPopular();
        }}
      />
    );
  }

  return (
    <div className="space-y-10">
      {/* Recommended Section */}
      {recommendedData?.data && recommendedData.data.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-display text-foreground">
              Rekomendasi Komik
            </h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
            {recommendedData.data.map((comic, index) => (
              <UnifiedMediaCard 
                key={comic.id} 
                index={index}
                title={comic.title}
                cover={comic.cover && comic.cover.startsWith('http') 
                    ? `/api/komik/getimage?url=${encodeURIComponent(comic.cover)}` 
                    : comic.cover}
                link={`/detail/komik/${comic.id}`}
                subtitle={comic.author}
                topLeftBadge={comic.status ? {
                  text: comic.status,
                  color: "#E52E2E"
                } : null}
              />
            ))}
          </div>
        </section>
      )}

      {/* Popular Section */}
      {popularData?.data && popularData.data.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-display text-foreground">
              Komik Populer
            </h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
            {popularData.data.map((comic, index) => (
              <UnifiedMediaCard 
                key={comic.id} 
                index={index}
                title={comic.title}
                cover={comic.cover && comic.cover.startsWith('http') 
                    ? `/api/komik/getimage?url=${encodeURIComponent(comic.cover)}` 
                    : comic.cover}
                link={`/detail/komik/${comic.id}`}
                subtitle={comic.author}
                topLeftBadge={comic.status ? {
                  text: comic.status,
                  color: "#E52E2E"
                } : null}
              />
            ))}
          </div>
        </section>
      )}

      {/* Latest Section */}
      {latestData?.data && latestData.data.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-display text-foreground">
              Update Terbaru
            </h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
            {latestData.data.map((comic, index) => (
              <UnifiedMediaCard 
                key={comic.id} 
                index={index}
                title={comic.title}
                cover={comic.cover && comic.cover.startsWith('http') 
                    ? `/api/komik/getimage?url=${encodeURIComponent(comic.cover)}` 
                    : comic.cover}
                link={`/detail/komik/${comic.id}`}
                subtitle={comic.lastChapter}
                topLeftBadge={comic.status ? {
                  text: comic.status,
                  color: "#E52E2E"
                } : null}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
