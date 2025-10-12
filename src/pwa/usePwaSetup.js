import { useCallback, useEffect, useState } from 'react';

const createIcon = (size) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  context.fillStyle = '#4f46e5';
  context.fillRect(0, 0, size, size);
  context.fillStyle = '#ffffff';
  context.font = `${Math.floor(size * 0.44)}px system-ui, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('ƒx', size / 2, size / 2 + size * 0.06);
  return canvas.toDataURL('image/png');
};

const createManifest = () => ({
  name: 'Taschenrechner Web App',
  short_name: 'Rechner',
  start_url: '.',
  display: 'standalone',
  background_color: '#0f172a',
  theme_color: '#4f46e5',
  icons: [
    { src: createIcon(192), sizes: '192x192', type: 'image/png' },
    { src: createIcon(512), sizes: '512x512', type: 'image/png' },
  ],
});

const SERVICE_WORKER_CODE = `
  const CACHE = 'calc-cache-v2';
  const ASSETS = ['.'];

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches
        .open(CACHE)
        .then((cache) => cache.addAll(ASSETS))
        .then(() => self.skipWaiting())
    );
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)),
          ),
        ),
    );
    self.clients.claim();
  });

  self.addEventListener('fetch', (event) => {
    const { request } = event;
    event.respondWith(
      caches
        .match(request)
        .then((cached) => {
          if (cached) {
            return cached;
          }
          return fetch(request)
            .then((response) => {
              if (request.method === 'GET' && new URL(request.url).origin === location.origin) {
                const clone = response.clone();
                caches.open(CACHE).then((cache) => cache.put(request, clone));
              }
              return response;
            })
            .catch(() => caches.match('.'));
        }),
    );
  });
`;

export const usePwaSetup = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installAvailable, setInstallAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const manifest = createManifest();
    const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    const manifestUrl = URL.createObjectURL(manifestBlob);
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = manifestUrl;
    document.head.appendChild(manifestLink);

    const serviceWorkerUrl = URL.createObjectURL(
      new Blob([SERVICE_WORKER_CODE], { type: 'text/javascript' }),
    );

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(serviceWorkerUrl).catch(() => {});
    }

    const beforeInstallHandler = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setInstallAvailable(true);
    };

    window.addEventListener('beforeinstallprompt', beforeInstallHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler);
      document.head.removeChild(manifestLink);
      URL.revokeObjectURL(manifestUrl);
      URL.revokeObjectURL(serviceWorkerUrl);
    };
  }, []);

  const requestInstall = useCallback(async () => {
    if (!installPrompt) {
      return false;
    }
    setInstallAvailable(false);
    try {
      installPrompt.prompt();
      await installPrompt.userChoice;
    } catch {
      // ignore
    } finally {
      setInstallPrompt(null);
    }
    return true;
  }, [installPrompt]);

  return {
    installAvailable,
    requestInstall,
  };
};
