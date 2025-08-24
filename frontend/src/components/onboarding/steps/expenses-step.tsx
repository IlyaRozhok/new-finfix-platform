"use client";

import { useState, useEffect } from "react";
import { useOnboardingStore, ExpenseData } from "@/stores/onboarding";
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
import { ArrowLeft, Plus, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { OnboardingService, Category } from "@/services/onboarding";

export function ExpensesStep() {
  const { prevStep, nextStep, data, updateData } = useOnboardingStore();

  const [expenses, setExpenses] = useState<ExpenseData[]>(
    data.fixedExpenses.length > 0
      ? data.fixedExpenses
      : [
          {
            id: uuidv4(),
            category_id: "",
            category_name: "",
            amount: 0,
            description: "",
          },
        ],
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        // TODO: Get actual userId from authentication context
        const userId = "temp-user-id";
        const fetchedCategories = await OnboardingService.getCategories(userId);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
        // Fallback categories are already handled in the service
      }
    };

    loadCategories();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const filledExpenses = expenses.filter(
      (expense) => expense.category_id && expense.amount > 0,
    );

    if (filledExpenses.length === 0) {
      newErrors.general = "Choose at least one category.";
    }

    expenses.forEach((expense, index) => {
      if (expense.category_id && !expense.amount) {
        const categoryName =
          categories.find((c) => c.id === expense.category_id)?.name ||
          "selected category";
        newErrors[`amount_${index}`] =
          `Please, enter the amount of the ${categoryName}.`;
      }
      if (expense.amount && expense.amount < 0) {
        newErrors[`amount_${index}`] = "Amount must be positive.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) return;

    const validExpenses = expenses.filter(
      (expense) => expense.category_id && expense.amount > 0,
    );

    updateData({ fixedExpenses: validExpenses });
    nextStep();
  };

  const handleBack = () => {
    prevStep();
  };

  const addExpenseRow = () => {
    setExpenses([
      ...expenses,
      {
        id: uuidv4(),
        category_id: "",
        category_name: "",
        amount: 0,
        description: "",
      },
    ]);
  };

  const removeExpenseRow = (id: string) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((expense) => expense.id !== id));
    }
  };

  const updateExpenseRow = (
    id: string,
    field: keyof ExpenseData,
    value: any,
  ) => {
    setExpenses(
      expenses.map((expense) => {
        if (expense.id === id) {
          const updatedExpense = { ...expense, [field]: value };

          // Update category name when category_id changes
          if (field === "category_id") {
            const category = categories.find((c) => c.id === value);
            updatedExpense.category_name = category?.name || "";
          }

          return updatedExpense;
        }
        return expense;
      }),
    );

    // Clear errors when user starts typing
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.general;
      const index = expenses.findIndex((e) => e.id === id);
      delete newErrors[`amount_${index}`];
      return newErrors;
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Add your fixed monthly expenses
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Bills and subscriptions you pay every month. Estimates are fine.
        </p>
      </div>

      {/* General Error */}
      {errors.general && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          {errors.general}
        </div>
      )}

      {/* Expense Rows */}
      <div className="space-y-4">
        {expenses.map((expense, index) => (
          <div
            key={expense.id}
            className="space-y-3 p-4 border rounded-lg relative"
          >
            {expenses.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={() => removeExpenseRow(expense.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {/* Category Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Select
                value={expense.category_id}
                onValueChange={(value) =>
                  updateExpenseRow(expense.id, "category_id", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={expense.amount || ""}
                onChange={(e) =>
                  updateExpenseRow(expense.id, "amount", Number(e.target.value))
                }
                className={
                  errors[`amount_${index}`] ? "border-destructive" : ""
                }
              />
              {errors[`amount_${index}`] && (
                <p className="text-sm text-destructive">
                  {errors[`amount_${index}`]}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Notes (optional)</Label>
              <Input
                placeholder="Add any additional details"
                value={expense.description || ""}
                onChange={(e) =>
                  updateExpenseRow(expense.id, "description", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        {/* Add New Row Button */}
        <Button
          type="button"
          variant="outline"
          onClick={addExpenseRow}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add another expense
        </Button>
      </div>

      {/* Tip */}
      <div className="p-3 text-sm text-muted-foreground bg-muted/50 rounded-md">
        <strong>Tip:</strong> One category required. You can refine categories
        later; this just helps your first dashboard.
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
