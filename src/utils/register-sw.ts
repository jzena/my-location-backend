export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(
        registration => {
          console.log('ServiceWorker successfully registered:', registration.scope);
        },
        err => {
          console.error('ServiceWorker registration failed:', err);
        }
      );
    });
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error('Failed to unregister ServiceWorker:', error);
      });
  }
}
