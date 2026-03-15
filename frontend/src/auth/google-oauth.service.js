// Google OAuth Service using Google Identity Services
class GoogleOAuthService {
  constructor() {
    this.clientId = null;
    this.isInitialized = false;
  }

  // Initialize Google Identity Services
  async initialize(clientId) {
    this.clientId = clientId;

    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      // Load Google Identity Services script
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          this.isInitialized = true;
          resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
      } else {
        this.isInitialized = true;
        resolve();
      }
    });
  }

  // Sign in with Google
  signIn() {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized || !window.google) {
        reject(new Error('Google Identity Services not initialized'));
        return;
      }

      let finished = false;
      const done = (fn, value) => {
        if (finished) return;
        finished = true;
        fn(value);
      };

      const timeoutId = setTimeout(() => {
        done(reject, new Error('Google Sign-In timeout. Încearcă din nou.'));
      }, 15000);

      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response) => {
          try {
            // Decode JWT token to get user info
            const payload = JSON.parse(atob(response.credential.split('.')[1]));

            const userData = {
              id: payload.sub,
              email: payload.email,
              name: payload.name,
              picture: payload.picture,
              provider: 'google'
            };

            clearTimeout(timeoutId);
            done(resolve, {
              credential: response.credential,
              user: userData
            });
          } catch (error) {
            clearTimeout(timeoutId);
            done(reject, error);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // Render the sign-in button or show the One Tap prompt
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          clearTimeout(timeoutId);
          done(reject, new Error('Google prompt indisponibil. Verifică setările browserului și client ID-ul.'));
        }

        if (notification.isDismissedMoment()) {
          clearTimeout(timeoutId);
          done(reject, new Error('Autentificarea Google a fost închisă înainte de finalizare.'));
        }
      });
    });
  }

  // Render Google Sign-In button
  renderSignInButton(elementId = 'google-signin-button') {
    if (!this.isInitialized || !window.google) return;

    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'signin_with',
        logo_alignment: 'left',
        width: '100%'
      }
    );
  }

  // Sign out
  signOut() {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
  }
}

export const googleOAuth = new GoogleOAuthService();