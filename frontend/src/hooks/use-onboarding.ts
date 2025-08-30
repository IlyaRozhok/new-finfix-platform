"use client";

import { useEffect, useState } from "react";
import { useOnboardingStore } from "@/stores/onboarding";

interface OnboardingConfig {
  requiredSteps: string[];
  redirectAfterCompletion?: string;
  skipForExistingUsers?: boolean;
}

interface UseOnboardingReturn {
  shouldShowOnboarding: boolean;
  isOnboardingRequired: boolean;
  onboardingProgress: number;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
  resetOnboarding: () => void;
}

export function useOnboarding(config?: OnboardingConfig): UseOnboardingReturn {
  const {
    currentStep,
    totalSteps,
    data,
    isCompleted,
    completeOnboarding: storeCompleteOnboarding,
    resetOnboarding: storeResetOnboarding,
  } = useOnboardingStore();

  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  const [isOnboardingRequired, setIsOnboardingRequired] = useState(false);

  useEffect(() => {
    // Check if user needs onboarding
    const checkOnboardingStatus = () => {
      const hasCompletedOnboarding = localStorage.getItem("onboarding-completed");
      const userHasPrimaryCurrency = data.primaryCurrency;

      // If onboarding was previously completed, don't show it
      if (hasCompletedOnboarding === "true") {
        setShouldShowOnboarding(false);
        setIsOnboardingRequired(false);
        return;
      }

      // Check if required data is missing
      const missingRequiredData = !userHasPrimaryCurrency;

      if (missingRequiredData) {
        setShouldShowOnboarding(true);
        setIsOnboardingRequired(true);
      } else {
        setShouldShowOnboarding(false);
        setIsOnboardingRequired(false);
      }
    };

    checkOnboardingStatus();
  }, [data, isCompleted]);

  const completeOnboarding = () => {
    storeCompleteOnboarding();
    localStorage.setItem("onboarding-completed", "true");
    setShouldShowOnboarding(false);
    setIsOnboardingRequired(false);

    // Redirect after completion if specified
    if (config?.redirectAfterCompletion) {
      window.location.href = config.redirectAfterCompletion;
    }
  };

  const skipOnboarding = () => {
    localStorage.setItem("onboarding-completed", "true");
    setShouldShowOnboarding(false);
    setIsOnboardingRequired(false);
  };

  const resetOnboarding = () => {
    storeResetOnboarding();
    localStorage.removeItem("onboarding-completed");
    setShouldShowOnboarding(true);
    setIsOnboardingRequired(true);
  };

  const onboardingProgress = (currentStep / totalSteps) * 100;

  return {
    shouldShowOnboarding,
    isOnboardingRequired,
    onboardingProgress,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
  };
}

// Helper hook for checking onboarding status in components
export function useOnboardingStatus() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const completed = localStorage.getItem("onboarding-completed") === "true";
    setHasCompletedOnboarding(completed);
  }, []);

  return {
    hasCompletedOnboarding,
    isLoading: hasCompletedOnboarding === null,
  };
}

export function checkOnboardingRequired(userData?: any) {
  return !userData?.primaryCurrency;
}
