"use client";

import { ThemeProvider } from "@/lib/theme";
import { AccessibilityProvider } from "@/lib/accessibility";
import { AccessibilityWidget } from "@/components/ui/accessibility-widget";
import { VoiceAssistant } from "@/components/ui/voice-assistant";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        {children}
        <AccessibilityWidget />
        <VoiceAssistant />
      </AccessibilityProvider>
    </ThemeProvider>
  );
}
