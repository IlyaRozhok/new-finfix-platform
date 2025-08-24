"use client";

import { OnboardingWizard } from "@/components/onboarding";
import { useOnboardingStore } from "@/stores/onboarding";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function OnboardingPage() {
  const { currentStep, data, resetOnboarding, completeOnboarding } =
    useOnboardingStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Testing Controls - Remove in production */}
      <div className="fixed top-4 right-4 z-50">
        <Card className="p-4 space-y-2">
          <p className="text-xs text-muted-foreground">Testing Controls</p>
          <div className="flex gap-2">
            <Button onClick={resetOnboarding} variant="outline" size="sm">
              Reset
            </Button>
            <Button onClick={completeOnboarding} variant="outline" size="sm">
              Complete
            </Button>
          </div>
          <div className="text-xs space-y-1">
            <p>Step: {currentStep}</p>
            <p>Currency: {data.primaryCurrency || "None"}</p>
          </div>
        </Card>
      </div>

      <OnboardingWizard />
    </div>
  );
}
