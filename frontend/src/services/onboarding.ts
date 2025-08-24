export interface Category {
  id: string;
  name: string;
}

export class OnboardingService {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  static async getCategories(userId: string): Promise<Category[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/api/categories/onboarding?uid=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const categories = await response.json();
      return categories;
    } catch (error) {
      console.error('Error fetching onboarding categories:', error);
      // Return fallback categories in case of API failure
      return [
        { id: '1', name: 'Housing' },
        { id: '2', name: 'Utilities' },
        { id: '3', name: 'Groceries' },
        { id: '4', name: 'Transportation' },
        { id: '5', name: 'Insurance' },
        { id: '6', name: 'Phone' },
        { id: '7', name: 'Internet' },
        { id: '8', name: 'Subscriptions' },
        { id: '9', name: 'Healthcare' },
        { id: '10', name: 'Other' },
      ];
    }
  }
}
