const CACHE_NAME = 'ar-cot-dien-v1.1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  // './icon-192.png', // Bỏ comment dòng này khi bạn đã có file ảnh
  // './icon-512.png'  // Bỏ comment dòng này khi bạn đã có file ảnh
];

// 1. Cài đặt Service Worker và Cache file
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Đang cache dữ liệu...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Kích hoạt và xóa cache cũ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('SW: Xóa cache cũ', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// 3. Xử lý yêu cầu mạng (Network request)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Trả về cache nếu có, nếu không thì tải từ mạng
      return response || fetch(event.request);
    })
  );
});