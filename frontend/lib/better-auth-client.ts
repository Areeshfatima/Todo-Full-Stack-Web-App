// frontend/lib/better-auth-client.ts
// Better Auth client-side configuration for JWT handling

// We'll create a simplified auth client that works with the API
// In a real implementation, we'd use the better-auth client properly

class BetterAuthClient {
  private token: string | null = null;

  constructor() {
    // Initialize with any existing token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('better-auth-token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('better-auth-token', token);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('better-auth-token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authClient = new BetterAuthClient();