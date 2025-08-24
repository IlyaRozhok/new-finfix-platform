"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Circle,
  Settings,
  Users,
  CreditCard,
  Globe,
  ArrowRight,
  Play,
  RotateCcw,
} from "lucide-react";
import { useOnboardingStore } from "@/stores/onboarding";
import { OnboardingWizard } from "@/components/onboarding";

interface DemoFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "completed" | "pending" | "available";
}

export function OnboardingDemo() {
  const [showWizard, setShowWizard] = useState(false);
  const { currentStep, data, isCompleted, resetOnboarding } =
    useOnboardingStore();

  const features: DemoFeature[] = [
    {
      title: "Welcome Step",
      description: "Personalized greeting with benefits overview",
      icon: <Users className="h-4 w-4" />,
      status:
        currentStep > 0
          ? "completed"
          : currentStep === 0
            ? "pending"
            : "available",
    },
    {
      title: "Currency Selection",
      description: "Choose primary currency with 40+ options",
      icon: <Globe className="h-4 w-4" />,
      status:
        currentStep > 1
          ? "completed"
          : currentStep === 1
            ? "pending"
            : "available",
    },
    {
      title: "Monthly Income",
      description: "Add recurring income sources and amounts",
      icon: <CreditCard className="h-4 w-4" />,
      status:
        currentStep > 2
          ? "completed"
          : currentStep === 2
            ? "pending"
            : "available",
    },
    {
      title: "Fixed Expenses",
      description: "Track monthly bills and subscriptions",
      icon: <Settings className="h-4 w-4" />,
      status:
        currentStep > 3
          ? "completed"
          : currentStep === 3
            ? "pending"
            : "available",
    },
    {
      title: "Loans & Credits",
      description: "Manage debts, loans, and credit balances",
      icon: <CreditCard className="h-4 w-4" />,
      status:
        currentStep > 4
          ? "completed"
          : currentStep === 4
            ? "pending"
            : "available",
    },
  ];

  const getStatusIcon = (status: DemoFeature["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Circle className="h-4 w-4 text-blue-500 fill-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: DemoFeature["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (showWizard) {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-50">
          <Button
            onClick={() => setShowWizard(false)}
            variant="outline"
            size="sm"
          >
            Close Demo
          </Button>
        </div>
        <OnboardingWizard />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          FinFix Onboarding System
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A complete user onboarding wizard built with Next.js, TypeScript,
          Tailwind CSS, shadcn/ui components, and Zustand for state management.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Current State */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Current State</h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Current Step:
                </span>
                <Badge variant="outline">{currentStep} of 4</Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Progress:</span>
                <Badge variant="outline">
                  {Math.round((Math.max(0, currentStep - 1) / 4) * 100)}%
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge
                  variant={isCompleted ? "default" : "secondary"}
                  className={isCompleted ? "bg-green-600" : ""}
                >
                  {isCompleted ? "Completed" : "In Progress"}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Collected Data:</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Primary Currency:</span>
                    <span>{data.primaryCurrency || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Income:</span>
                    <span>
                      {data.monthlyIncome
                        ? `$${data.monthlyIncome.amount}`
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fixed Expenses:</span>
                    <span>{data.fixedExpenses.length} categories</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Debts/Credits:</span>
                    <span>{data.debts.length} entries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Features Overview */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="text-xl font-semibold">Features</h2>
            </div>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    {getStatusIcon(feature.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {feature.icon}
                        <span className="font-medium text-sm">
                          {feature.title}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getStatusColor(feature.status)}`}
                  >
                    {feature.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Demo Actions */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Play className="h-5 w-5" />
            Try It Out
          </h2>

          <p className="text-muted-foreground">
            Experience the complete onboarding flow with interactive steps, form
            validation, and smooth transitions.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setShowWizard(true)}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start Onboarding Demo
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              onClick={resetOnboarding}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset State
            </Button>
          </div>
        </div>
      </Card>

      {/* Technical Details */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Technical Implementation</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-blue-600 dark:text-blue-400">
                State Management
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Zustand for global state</li>
                <li>• Persistent step tracking</li>
                <li>• Form data management</li>
                <li>• Progress calculation</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm text-green-600 dark:text-green-400">
                UI Components
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• shadcn/ui components</li>
                <li>• Tailwind CSS styling</li>
                <li>• Responsive design</li>
                <li>• Dark mode support</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm text-purple-600 dark:text-purple-400">
                User Experience
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Progressive disclosure</li>
                <li>• Form validation</li>
                <li>• Navigation controls</li>
                <li>• Completion tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Implementation Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">5</div>
          <div className="text-xs text-muted-foreground">Steps Implemented</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">40+</div>
          <div className="text-xs text-muted-foreground">
            Currencies Available
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">100%</div>
          <div className="text-xs text-muted-foreground">Mobile Responsive</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">0</div>
          <div className="text-xs text-muted-foreground">
            External Dependencies
          </div>
        </Card>
      </div>
    </div>
  );
}
