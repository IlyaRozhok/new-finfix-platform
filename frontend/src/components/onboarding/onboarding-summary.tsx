"use client";

import { useOnboardingStore } from "@/stores/onboarding";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  User,
  Globe,
  DollarSign,
  Receipt,
  CreditCard,
  Calendar,
  Building,
  RotateCcw,
  Copy
} from "lucide-react";
import { format } from "date-fns";
import { getCurrencyByCode } from "@/lib/currencies";

export function OnboardingSummary() {
  const { data, currentStep, isCompleted, resetOnboarding } = useOnboardingStore();

  const copyDataToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const formatCurrency = (amount: number) => {
    const currency = getCurrencyByCode(data.primaryCurrency || "USD");
    return `${currency?.symbol || "$"}${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <h1 className="text-2xl font-semibold">Onboarding Summary</h1>
        </div>
        <p className="text-muted-foreground">
          Review the data collected during onboarding
        </p>
      </div>

      {/* Status */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={isCompleted ? "default" : "secondary"}>
                {isCompleted ? "Completed" : "In Progress"}
              </Badge>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Current Step:</span>
              <Badge variant="outline">{currentStep}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={copyDataToClipboard}
              variant="outline"
              size="sm"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy JSON
            </Button>
            <Button
              onClick={resetOnboarding}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Basic Info */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Basic Information</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Primary Currency:</span>
            <Badge variant="outline">
              {data.primaryCurrency ? (
                <div className="flex items-center gap-1">
                  {getCurrencyByCode(data.primaryCurrency)?.flag}
                  {data.primaryCurrency}
                </div>
              ) : (
                "Not selected"
              )}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Monthly Income */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-green-500" />
          <h2 className="text-lg font-semibold">Monthly Income</h2>
        </div>

        {data.monthlyIncome ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Source
                </span>
                <p className="font-medium capitalize">
                  {data.monthlyIncome.source.replace("_", " ")}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Amount
                </span>
                <p className="font-medium text-green-600">
                  {formatCurrency(data.monthlyIncome.amount)}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Payday
                </span>
                <p className="font-medium">
                  {formatDate(data.monthlyIncome.start_date)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No income data collected</p>
        )}
      </Card>

      {/* Fixed Expenses */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold">Fixed Expenses</h2>
          <Badge variant="secondary" className="ml-auto">
            {data.fixedExpenses.length} categories
          </Badge>
        </div>

        {data.fixedExpenses.length > 0 ? (
          <div className="space-y-3">
            {data.fixedExpenses.map((expense, index) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium">{expense.category_name}</p>
                  {expense.description && (
                    <p className="text-sm text-muted-foreground">
                      {expense.description}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className="font-medium">
                  {formatCurrency(expense.amount)}
                </Badge>
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between font-semibold">
              <span>Total Monthly Expenses:</span>
              <span className="text-orange-600">
                {formatCurrency(
                  data.fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0)
                )}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No expenses collected</p>
        )}
      </Card>

      {/* Debts */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-semibold">Loans & Credits</h2>
          <Badge variant="secondary" className="ml-auto">
            {data.debts.length} entries
          </Badge>
        </div>

        {data.debts.length > 0 ? (
          <div className="space-y-4">
            {data.debts.map((debt, index) => (
              <div
                key={index}
                className="p-4 bg-muted/30 rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {debt.debt_type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {debt.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="font-medium text-red-600">
                    {formatCurrency(debt.total_debt)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {debt.interest_rate_monthly && (
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        Interest
                      </span>
                      <p>{debt.interest_rate_monthly}% APR</p>
                    </div>
                  )}

                  {debt.grace_period_days && (
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        Grace Period
                      </span>
                      <p>{debt.grace_period_days} days</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      Start Date
                    </span>
                    <p>{formatDate(debt.start_date)}</p>
                  </div>

                  {debt.due_day && (
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        Due Date
                      </span>
                      <p>{formatDate(debt.due_day)}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <Separator />
            <div className="flex items-center justify-between font-semibold">
              <span>Total Debt:</span>
              <span className="text-red-600">
                {formatCurrency(
                  data.debts.reduce((sum, debt) => sum + debt.total_debt, 0)
                )}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No debts collected</p>
        )}
      </Card>

      {/* Financial Overview */}
      {data.monthlyIncome && data.fixedExpenses.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30">
          <div className="flex items-center gap-2 mb-4">
            <Building className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Financial Overview</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Monthly Income
              </span>
              <p className="text-xl font-semibold text-green-600">
                {formatCurrency(data.monthlyIncome.amount)}
              </p>
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Fixed Expenses
              </span>
              <p className="text-xl font-semibold text-orange-600">
                {formatCurrency(
                  data.fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0)
                )}
              </p>
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Available
              </span>
              <p className={`text-xl font-semibold ${
                (data.monthlyIncome.amount -
                 data.fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0)) >= 0
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(
                  data.monthlyIncome.amount -
                  data.fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0)
                )}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
