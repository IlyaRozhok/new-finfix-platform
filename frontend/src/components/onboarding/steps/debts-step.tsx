"use client";

import { useState } from "react";
import { useOnboardingStore, DebtData } from "@/stores/onboarding";
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
import { ArrowLeft, Calendar as CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

const DEBT_TYPES = [
  { value: "credit_card", label: "Credit Card" },
  { value: "personal_loan", label: "Personal Loan" },
  { value: "car_loan", label: "Car Loan" },
  { value: "mortgage", label: "Mortgage" },
  { value: "other", label: "Other" },
];

interface DebtFormData extends DebtData {
  id: string;
}

export function DebtsStep() {
  const { prevStep, completeOnboarding, data, updateData } =
    useOnboardingStore();

  const [debts, setDebts] = useState<DebtFormData[]>(
    data.debts.length > 0
      ? data.debts.map((debt, index) => ({ ...debt, id: `debt_${index}` }))
      : [],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    debts.forEach((debt, index) => {
      if (!debt.debt_type) {
        newErrors[`type_${index}`] = "Please select a debt type.";
      }

      if (!debt.description.trim()) {
        const typeLabel =
          DEBT_TYPES.find((t) => t.value === debt.debt_type)?.label || "debt";
        if (debt.debt_type === "credit_card") {
          newErrors[`description_${index}`] =
            "Please enter the bank/card name.";
        } else if (debt.debt_type === "personal_loan") {
          newErrors[`description_${index}`] = "Please enter the lender.";
        } else {
          newErrors[`description_${index}`] =
            `Please enter the ${typeLabel.toLowerCase()} description.`;
        }
      }

      if (!debt.total_debt || debt.total_debt < 0) {
        newErrors[`balance_${index}`] = "Enter a non-negative balance.";
      }

      if (!debt.start_date) {
        newErrors[`start_date_${index}`] = "Please select a start date.";
      }

      if (debt.interest_rate_monthly && debt.interest_rate_monthly < 0) {
        newErrors[`interest_${index}`] = "Interest rate must be non-negative.";
      }

      if (debt.grace_period_days && debt.grace_period_days < 0) {
        newErrors[`grace_${index}`] = "Grace period must be non-negative.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (debts.length > 0 && !validateForm()) return;

    const validDebts = debts.map(({ id, ...debt }) => debt);
    updateData({ debts: validDebts });
    completeOnboarding();
  };

  const handleBack = () => {
    prevStep();
  };

  const addDebtRow = () => {
    const newDebt: DebtFormData = {
      id: uuidv4(),
      debt_type: "",
      description: "",
      total_debt: 0,
      start_date: new Date().toISOString(),
    };
    setDebts([...debts, newDebt]);
  };

  const removeDebtRow = (id: string) => {
    setDebts(debts.filter((debt) => debt.id !== id));
  };

  const updateDebtRow = (id: string, field: keyof DebtData, value: any) => {
    setDebts(
      debts.map((debt) => {
        if (debt.id === id) {
          return { ...debt, [field]: value };
        }
        return debt;
      }),
    );

    // Clear errors when user starts typing
    setErrors((prev) => {
      const newErrors = { ...prev };
      const index = debts.findIndex((d) => d.id === id);
      delete newErrors[`${field}_${index}`];
      return newErrors;
    });
  };

  const getDescriptionPlaceholder = (debtType: string) => {
    switch (debtType) {
      case "credit_card":
        return "e.g., Chase Visa, Bank of America Mastercard";
      case "personal_loan":
        return "e.g., Wells Fargo, Credit Union";
      case "car_loan":
        return "e.g., Toyota Financial, Bank Auto Loan";
      case "mortgage":
        return "e.g., ABC Bank Mortgage";
      default:
        return "e.g., Student Loan, Medical Debt";
    }
  };

  const getDescriptionLabel = (debtType: string) => {
    switch (debtType) {
      case "credit_card":
        return "Bank/Card name";
      case "personal_loan":
        return "Lender";
      default:
        return "Description";
    }
  };

  const shouldShowGracePeriod = (debtType: string) => {
    return debtType === "credit_card";
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Do you have any loans or credit balances?
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Add active loans and credit cards so we can track balances and due
          dates.
        </p>
      </div>

      {/* Debt Rows */}
      {debts.length > 0 && (
        <div className="space-y-4">
          {debts.map((debt, index) => (
            <div
              key={debt.id}
              className="space-y-4 p-4 border rounded-lg relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={() => removeDebtRow(debt.id)}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Debt Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Type</Label>
                  <Select
                    value={debt.debt_type}
                    onValueChange={(value) =>
                      updateDebtRow(debt.id, "debt_type", value)
                    }
                  >
                    <SelectTrigger
                      className={
                        errors[`type_${index}`] ? "border-destructive" : ""
                      }
                    >
                      <SelectValue placeholder="Select debt type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEBT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors[`type_${index}`] && (
                    <p className="text-sm text-destructive">
                      {errors[`type_${index}`]}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {getDescriptionLabel(debt.debt_type)}
                  </Label>
                  <Input
                    placeholder={getDescriptionPlaceholder(debt.debt_type)}
                    value={debt.description}
                    onChange={(e) =>
                      updateDebtRow(debt.id, "description", e.target.value)
                    }
                    className={
                      errors[`description_${index}`] ? "border-destructive" : ""
                    }
                  />
                  {errors[`description_${index}`] && (
                    <p className="text-sm text-destructive">
                      {errors[`description_${index}`]}
                    </p>
                  )}
                </div>

                {/* Current Balance */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Current balance</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={debt.total_debt || ""}
                    onChange={(e) =>
                      updateDebtRow(
                        debt.id,
                        "total_debt",
                        Number(e.target.value),
                      )
                    }
                    className={
                      errors[`balance_${index}`] ? "border-destructive" : ""
                    }
                  />
                  {errors[`balance_${index}`] && (
                    <p className="text-sm text-destructive">
                      {errors[`balance_${index}`]}
                    </p>
                  )}
                </div>

                {/* Interest Rate */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Interest (APR, optional)
                  </Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={debt.interest_rate_monthly || ""}
                    onChange={(e) =>
                      updateDebtRow(
                        debt.id,
                        "interest_rate_monthly",
                        Number(e.target.value),
                      )
                    }
                    className={
                      errors[`interest_${index}`] ? "border-destructive" : ""
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Monthly interest rate
                  </p>
                  {errors[`interest_${index}`] && (
                    <p className="text-sm text-destructive">
                      {errors[`interest_${index}`]}
                    </p>
                  )}
                </div>

                {/* Grace Period - Only for Credit Cards */}
                {shouldShowGracePeriod(debt.debt_type) && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Grace period days
                    </Label>
                    <Input
                      type="number"
                      placeholder="21"
                      value={debt.grace_period_days || ""}
                      onChange={(e) =>
                        updateDebtRow(
                          debt.id,
                          "grace_period_days",
                          Number(e.target.value),
                        )
                      }
                      className={
                        errors[`grace_${index}`] ? "border-destructive" : ""
                      }
                    />
                    {errors[`grace_${index}`] && (
                      <p className="text-sm text-destructive">
                        {errors[`grace_${index}`]}
                      </p>
                    )}
                  </div>
                )}

                {/* Start Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Start date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !debt.start_date && "text-muted-foreground",
                          errors[`start_date_${index}`] && "border-destructive",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {debt.start_date
                          ? format(new Date(debt.start_date), "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          debt.start_date
                            ? new Date(debt.start_date)
                            : undefined
                        }
                        onSelect={(date) =>
                          updateDebtRow(
                            debt.id,
                            "start_date",
                            date?.toISOString(),
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors[`start_date_${index}`] && (
                    <p className="text-sm text-destructive">
                      {errors[`start_date_${index}`]}
                    </p>
                  )}
                </div>

                {/* Due Day */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Due day (optional)
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !debt.due_day && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {debt.due_day
                          ? format(new Date(debt.due_day), "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          debt.due_day ? new Date(debt.due_day) : undefined
                        }
                        onSelect={(date) =>
                          updateDebtRow(debt.id, "due_day", date?.toISOString())
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Debt Button */}
      <Button
        type="button"
        variant="outline"
        onClick={addDebtRow}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a debt
      </Button>

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
