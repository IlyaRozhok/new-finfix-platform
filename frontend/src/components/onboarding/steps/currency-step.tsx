"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/stores/onboarding";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import {
  CURRENCIES,
  POPULAR_CURRENCIES,
  formatCurrencyWithFlag,
  getCurrencyByCode,
} from "@/lib/currencies";

export function CurrencyStep() {
  const { prevStep, nextStep, updateData, data } = useOnboardingStore();
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    data.primaryCurrency || "",
  );
  const [error, setError] = useState<string>("");

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
    setError("");
    updateData({ primaryCurrency: value });
  };

  const handleContinue = () => {
    if (!selectedCurrency) {
      setError("Please select a currency to continue.");
      return;
    }

    nextStep();
  };

  const handleBack = () => {
    prevStep();
  };

  // Separate popular and other currencies
  const popularCurrencies = CURRENCIES.filter((c) =>
    POPULAR_CURRENCIES.includes(c.code),
  );
  const otherCurrencies = CURRENCIES.filter(
    (c) => !POPULAR_CURRENCIES.includes(c.code),
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Choose your primary currency
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          This sets the default for balances, budgets, and reports.
        </p>
      </div>

      {/* Currency Selection */}
      <div className="space-y-3">
        <Label htmlFor="currency-select" className="text-sm font-medium">
          Primary currency
        </Label>
        <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
          <SelectTrigger
            className={`w-full ${error ? "border-destructive" : ""}`}
          >
            <SelectValue placeholder="Select a currency (e.g., UAH — Ukrainian Hryvnia)" />
          </SelectTrigger>
          <SelectContent>
            {/* Popular currencies first */}
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Popular
            </div>
            {popularCurrencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {formatCurrencyWithFlag(currency)}
              </SelectItem>
            ))}

            {/* Separator */}
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-t mt-2">
              All currencies
            </div>

            {/* Other currencies */}
            {otherCurrencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {formatCurrencyWithFlag(currency)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Help text or error */}
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            You can change this anytime in Settings.
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 pt-4">
        <Button
          onClick={handleContinue}
          size="lg"
          className="w-full font-medium"
        >
          Continue
        </Button>
        <Button
          onClick={handleBack}
          variant="ghost"
          size="lg"
          className="w-full font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}
