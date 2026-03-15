"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPopup, setShowInstallPopup] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed or installed
    const hasDismissed = localStorage.getItem("pwa-install-dismissed") === "true";
    
    // Also check if app is already running in standalone mode (already installed)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || 
                         ("standalone" in navigator && (navigator as any).standalone === true);
    
    if (isStandalone) {
      return; // Already installed, do not show
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // If user hasn't dismissed before, show popup
      if (!hasDismissed) {
        setShowInstallPopup(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // Clear the deferredPrompt and hide the popup regardless of outcome
    setDeferredPrompt(null);
    setShowInstallPopup(false);
    
    // If successfully installed, we might want to never show again
    if (outcome === "accepted") {
      localStorage.setItem("pwa-install-dismissed", "true");
    }
  };

  const handleDismiss = () => {
    setShowInstallPopup(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!showInstallPopup) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-full duration-300">
      <div className="container mx-auto max-w-md">
        <div className="glass-strong border border-border/50 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm">Install Cobanonton</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Install aplikasi ini di perangkat Anda untuk pengalaman yang lebih baik.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/50 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
