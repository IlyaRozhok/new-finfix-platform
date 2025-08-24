export type User = {
  id: string;
  email: string;
  userName?: string;
  avatarUrl?: string;
};

export type OnboardingData = {
  username?: string;
  primaryCurrency?: string;
};

export type OnboardingStep = {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType;
  isCompleted: boolean;
  isAccessible: boolean;
};
