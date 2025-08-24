import { create } from "zustand";

export interface IncomeData {
  source: string;
  amount: number;
  start_date: string;
}

export interface ExpenseData {
  id: string;
  category_id: string;
  category_name: string;
  amount: number;
  description?: string;
}

export interface DebtData {
  debt_type: string;
  description: string;
  total_debt: number;
  interest_rate_monthly?: number;
  grace_period_days?: number;
  start_date: string;
  due_day?: string;
}

export interface OnboardingData {
  username?: string;
  primaryCurrency?: string;
  monthlyIncome?: IncomeData;
  fixedExpenses: ExpenseData[];
  debts: DebtData[];
}

export interface OnboardingStore {
  currentStep: number;
  totalSteps: number;
  data: OnboardingData;
  isCompleted: boolean;

  // Actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateData: (data: Partial<OnboardingData>) => void;
  updateIncome: (income: IncomeData) => void;
  addExpense: (expense: ExpenseData) => void;
  updateExpense: (id: string, expense: Partial<ExpenseData>) => void;
  removeExpense: (id: string) => void;
  addDebt: (debt: DebtData) => void;
  updateDebt: (index: number, debt: Partial<DebtData>) => void;
  removeDebt: (index: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  currentStep: 0, // Start with welcome step (0)
  totalSteps: 4, // Welcome(0), Currency(1), Income(2), Expenses(3), Debts(4)
  data: {
    fixedExpenses: [],
    debts: [],
  },
  isCompleted: false,

  nextStep: () => {
    const { currentStep, totalSteps } = get();
    console.log(
      "NextStep called - Current:",
      currentStep,
      "Total:",
      totalSteps,
    );
    if (currentStep < totalSteps) {
      const newStep = currentStep + 1;
      console.log("Moving to step:", newStep);
      set({ currentStep: newStep });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  goToStep: (step: number) => {
    const { totalSteps } = get();
    if (step >= 0 && step <= totalSteps) {
      set({ currentStep: step });
    }
  },

  updateData: (newData: Partial<OnboardingData>) => {
    set((state) => ({
      data: { ...state.data, ...newData },
    }));
  },

  updateIncome: (income: IncomeData) => {
    set((state) => ({
      data: { ...state.data, monthlyIncome: income },
    }));
  },

  addExpense: (expense: ExpenseData) => {
    set((state) => ({
      data: {
        ...state.data,
        fixedExpenses: [...state.data.fixedExpenses, expense],
      },
    }));
  },

  updateExpense: (id: string, expenseUpdate: Partial<ExpenseData>) => {
    set((state) => ({
      data: {
        ...state.data,
        fixedExpenses: state.data.fixedExpenses.map((expense) =>
          expense.id === id ? { ...expense, ...expenseUpdate } : expense,
        ),
      },
    }));
  },

  removeExpense: (id: string) => {
    set((state) => ({
      data: {
        ...state.data,
        fixedExpenses: state.data.fixedExpenses.filter(
          (expense) => expense.id !== id,
        ),
      },
    }));
  },

  addDebt: (debt: DebtData) => {
    set((state) => ({
      data: {
        ...state.data,
        debts: [...state.data.debts, debt],
      },
    }));
  },

  updateDebt: (index: number, debtUpdate: Partial<DebtData>) => {
    set((state) => ({
      data: {
        ...state.data,
        debts: state.data.debts.map((debt, i) =>
          i === index ? { ...debt, ...debtUpdate } : debt,
        ),
      },
    }));
  },

  removeDebt: (index: number) => {
    set((state) => ({
      data: {
        ...state.data,
        debts: state.data.debts.filter((_, i) => i !== index),
      },
    }));
  },

  completeOnboarding: () => {
    set({ isCompleted: true });
  },

  resetOnboarding: () => {
    console.log("Resetting onboarding to step 0");
    set({
      currentStep: 0,
      data: {
        fixedExpenses: [],
        debts: [],
      },
      isCompleted: false,
    });
  },
}));
