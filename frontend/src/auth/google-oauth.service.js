class GoogleOAuthService {
  constructor() {
    this.clientId = null;
    this.isInitialized = false;
    this._scriptLoaded = false;
    this._loadPromise = null;
  }

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

  async initialize(clientId) {
    if (!clientId || clientId === 'your-google-client-id') {
      throw new Error('Google Client ID not configured. Set VITE_GOOGLE_CLIENT_ID in .env');
    }
    this.clientId = clientId;
    await this._loadScript();
    this.isInitialized = true;
  }

  /**
   * OAuth2 implicit flow via a popup opened directly from the user's click.
   * This is Google's supported path for custom-styled buttons: unlike the rendered
   * "Sign in with Google" iframe button, it does not depend on FedCM or on synthetic
   * clicks and works the same in every browser.
   * Must be called synchronously from a user gesture (click) or the popup gets blocked.
   * Resolves with { accessToken, user } where user comes from Google's userinfo endpoint.
   */
  requestAccessToken() {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized || !window.google?.accounts?.oauth2) {
        reject(new Error('Google Identity Services not initialized'));
        return;
      }

      let tokenClient;
      try {
        tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: this.clientId,
          scope: 'openid email profile',
          callback: async (response) => {
            if (response?.error) {
              reject(new Error(response.error_description || response.error));
              return;
            }
            if (!response?.access_token) {
              reject(new Error('No access token received from Google'));
              return;
            }
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` },
              });
              if (!res.ok) throw new Error(`Google userinfo failed (${res.status})`);
              const profile = await res.json();
              resolve({
                accessToken: response.access_token,
                user: {
                  id: profile.sub,
                  email: profile.email,
                  name: profile.name,
                  picture: profile.picture,
                  provider: 'google',
                },
              });
            } catch (error) {
              reject(error);
            }
          },
          error_callback: (err) => {
            // popup_closed / popup_failed_to_open / unknown
            reject(new Error(err?.type || 'Google sign-in was cancelled'));
          },
        });
      } catch (error) {
        reject(error);
        return;
      }

      tokenClient.requestAccessToken();
    });
  }

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

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.info('Google One Tap not displayed, use the sign-in button instead.');
        }
      });
    });
  }

  renderButton(container, callback, options = {}) {
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
      width: options.width || 400,
    });
  }

  signOut() {
    if (window.google?.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
  }
}

export const googleOAuth = new GoogleOAuthService();