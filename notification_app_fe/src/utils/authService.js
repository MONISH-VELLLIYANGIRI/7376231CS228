const API_BASE_URL = 'http://localhost:5000/api';

// Store auth credentials (you'll provide these)
const AUTH_CREDENTIALS = {
  email: '', // To be provided by user
  name: '', // To be provided by user
  rollNo: '', // To be provided by user
  accessCode: '', // To be provided by user
  clientID: '', // To be provided by user
  clientSecret: '', // To be provided by user
};

class AuthService {
  constructor() {
    this.accessToken = null;
    this.expiresAt = null;
    this.isLoading = false;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  // Set credentials (call this with user's registration details)
  setCredentials(credentials) {
    Object.assign(AUTH_CREDENTIALS, credentials);
    console.log('[AuthService] Credentials configured');
  }

  // Get access token, fetch if expired
  async getAccessToken() {
    // Return existing token if still valid
    if (this.accessToken && this.expiresAt && Date.now() < this.expiresAt) {
      console.log('[AuthService] Using cached token');
      return this.accessToken;
    }

    // Fetch new token
    if (!this.isLoading) {
      await this.fetchToken();
    }

    return this.accessToken;
  }

  // Fetch new access token from auth endpoint
  async fetchToken() {
    if (this.isLoading) {
      console.log('[AuthService] Token fetch already in progress');
      return;
    }
    
    this.isLoading = true;
    this.retryCount = 0;

    try {
      // Validate credentials are set
      if (!AUTH_CREDENTIALS.email || !AUTH_CREDENTIALS.clientID) {
        throw new Error('Auth credentials not configured. Please provide registration details.');
      }

      const requestBody = {
        email: AUTH_CREDENTIALS.email,
        name: AUTH_CREDENTIALS.name,
        rollNo: AUTH_CREDENTIALS.rollNo,
        accessCode: AUTH_CREDENTIALS.accessCode,
        clientID: AUTH_CREDENTIALS.clientID,
        clientSecret: AUTH_CREDENTIALS.clientSecret,
      };

      console.log('[AuthService] Fetching access token from /auth endpoint');
      console.log('[AuthService] Request body:', requestBody);

      const response = await fetch(`${API_BASE_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('[AuthService] Auth response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('[AuthService] Auth error response:', errorData);
        throw new Error(`Auth failed: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('[AuthService] Auth response data:', data);

      // Store token and expiration
      this.accessToken = data.access_token;
      this.expiresAt = Date.now() + (data.expires_in * 1000); // Convert to milliseconds

      console.log('[AuthService] Token obtained successfully');
      console.log('[AuthService] Token expires at:', new Date(this.expiresAt).toISOString());

      return this.accessToken;
    } catch (error) {
      console.error('[AuthService] Failed to fetch token:', error.message);
      this.accessToken = null;
      this.expiresAt = null;

      // Retry logic
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`[AuthService] Retrying token fetch (attempt ${this.retryCount}/${this.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
        return this.fetchToken();
      }

      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Clear stored token
  clearToken() {
    this.accessToken = null;
    this.expiresAt = null;
    console.log('[AuthService] Auth token cleared');
  }

  // Check if authenticated
  isAuthenticated() {
    return !!this.accessToken && this.expiresAt && Date.now() < this.expiresAt;
  }
}

// Export singleton instance
// eslint-disable-next-line import/no-anonymous-default-export
export default new AuthService();
