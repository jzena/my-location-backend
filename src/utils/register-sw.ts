export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(
        registration => {
          console.log('ServiceWorker registrado con éxito:', registration.scope);
        },
        err => {
          console.error('Registro del Service Worker fallido:', err);
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
        console.error('Error al desregistrar el Service Worker:', error);
      });
  }
}
