"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/stores/onboarding";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const INCOME_SOURCES = [
  { value: "salary", label: "Salary" },
  { value: "freelance", label: "Freelance" },
  { value: "passive", label: "Passive Income" },
  { value: "business", label: "Business Income" },
  { value: "investment", label: "Investment Returns" },
  { value: "rental", label: "Rental Income" },
  { value: "other", label: "Other" },
];

export function IncomeStep() {
  const { prevStep, nextStep, updateIncome, data } = useOnboardingStore();

  const [source, setSource] = useState<string>(
    data.monthlyIncome?.source || "",
  );
  const [amount, setAmount] = useState<string>(
    data.monthlyIncome?.amount ? data.monthlyIncome.amount.toString() : "",
  );
  const [payDate, setPayDate] = useState<Date | undefined>(
    data.monthlyIncome?.start_date
      ? new Date(data.monthlyIncome.start_date)
      : undefined,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!source) {
      newErrors.source = "Please select an income source.";
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid income amount.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) return;

    const incomeData = {
      source,
      amount: Number(amount),
      start_date: payDate!.toISOString(),
    };

    updateIncome(incomeData);
    nextStep();
  };

  const handleBack = () => {
    prevStep();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Determine your monthly income
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Add your recurring income after taxes. If it varies, use an average.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Income Source */}
        <div className="space-y-2">
          <Label htmlFor="income-source" className="text-sm font-medium">
            Source
          </Label>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger
              className={errors.source ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Select income source" />
            </SelectTrigger>
            <SelectContent>
              {INCOME_SOURCES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.source && (
            <p className="text-sm text-destructive">{errors.source}</p>
          )}
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="income-amount" className="text-sm font-medium">
            Amount
          </Label>
          <Input
            id="income-amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={errors.amount ? "border-destructive" : ""}
          />
          {errors.amount && (
            <p className="text-sm text-destructive">{errors.amount}</p>
          )}
        </div>

        {/* Payday */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Payday</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !payDate && "text-muted-foreground",
                  errors.payDate && "border-destructive",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {payDate ? format(payDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={payDate}
                onSelect={setPayDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.payDate && (
            <p className="text-sm text-destructive">{errors.payDate}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
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
