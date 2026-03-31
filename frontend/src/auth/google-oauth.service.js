// Google OAuth Service using Google Identity Services (GIS)
// Uses the rendered button approach which is more reliable than prompt()
class GoogleOAuthService {
  constructor() {
    this.clientId = null;
    this.isInitialized = false;
    this._scriptLoaded = false;
    this._loadPromise = null;
  }

  // Load the GIS script (cached)
  _loadScript() {
    if (this._loadPromise) return this._loadPromise;
    if (window.google?.accounts?.id) {
      this._scriptLoaded = true;
      return Promise.resolve();
    }

    this._loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => { this._scriptLoaded = true; resolve(); };
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    });
    return this._loadPromise;
  }

  // Initialize Google Identity Services
  async initialize(clientId) {
    if (!clientId || clientId === 'your-google-client-id') {
      throw new Error('Google Client ID not configured. Set VITE_GOOGLE_CLIENT_ID in .env');
    }
    this.clientId = clientId;
    await this._loadScript();
    this.isInitialized = true;
  }

  // Sign in with Google using a temporary rendered button
  // This is more reliable than prompt() which is often blocked by browsers
  signIn() {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized || !window.google?.accounts?.id) {
        reject(new Error('Google Identity Services not initialized'));
        return;
      }

      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response) => {
          try {
            if (!response?.credential) {
              reject(new Error('No credential received from Google'));
              return;
            }
            // Decode JWT payload to get user info
            const base64 = response.credential.split('.')[1];
            const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
            const payload = JSON.parse(json);

            resolve({
              credential: response.credential,
              user: {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                provider: 'google'
              }
            });
          } catch (error) {
            reject(error);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        ux_mode: 'popup',
      });

      // Try prompt first, fall back gracefully
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // prompt() was blocked - this is common. Not an error for rendered buttons.
          // The rendered button in GoogleSignInButton component will still work.
          console.info('Google One Tap not displayed, use the sign-in button instead.');
        }
      });
    });
  }

  // Render Google Sign-In button into a container element
  renderButton(container, callback) {
    if (!this.isInitialized || !window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response) => {
        try {
          if (!response?.credential) {
            callback(new Error('No credential received'), null);
            return;
          }
          const base64 = response.credential.split('.')[1];
          const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
          const payload = JSON.parse(json);

          callback(null, {
            credential: response.credential,
            user: {
              id: payload.sub,
              email: payload.email,
              name: payload.name,
              picture: payload.picture,
              provider: 'google'
            }
          });
        } catch (error) {
          callback(error, null);
        }
      },
      auto_select: false,
    });

    window.google.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      text: 'signin_with',
      logo_alignment: 'left',
      width: 400,
    });
  }

  // Sign out
  signOut() {
    if (window.google?.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
  }
}

export const googleOAuth = new GoogleOAuthService();