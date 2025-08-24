"use client";

import { useOnboardingStore } from "@/stores/onboarding";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function WelcomeStep() {
  const { nextStep, data, currentStep } = useOnboardingStore();

  const handleGetStarted = () => {
    console.log("Get started clicked, current step:", currentStep);
    nextStep();
  };

  return (
    <div className="space-y-6 text-center">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome to FinFix{data.username ? `, ${data.username}` : ""}
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          We'll ask a few quick questions to personalize your dashboard. You can
          edit everything later.
        </p>
      </div>

      {/* Benefits List */}
      <div className="space-y-4 py-6">
        <div className="flex items-center gap-3 text-left">
          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
          <span className="text-sm text-foreground">
            Takes about several minutes
          </span>
        </div>
        <div className="flex items-center gap-3 text-left">
          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
          <span className="text-sm text-foreground">
            All your data is completely safe
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-4">
        <Button
          onClick={handleGetStarted}
          size="lg"
          className="w-full font-medium"
          type="button"
        >
          Get started
        </Button>
      </div>
    </div>
  );
}
