// public/sw.js
// self.addEventListener('push', event => {
//     let data = {};
//     try { data = event.data.json(); } catch (e) { data = { title: 'Incoming Lead', body: 'Tap to call' }; }
//     const title = data.title || 'Incoming Lead';
//     const options = {
//         body: data.body || `Tap to call ${data.phone}`,
//         data: { phone: data.phone, origin: data.origin, initiatedBy: data.initiatedBy },
//         tag: data.tag || 'click-to-call',
//         renotify: true
//     };
//     event.waitUntil(self.registration.showNotification(title, options));
// });

// public/sw.js
// self.addEventListener("push", event => {
//     let data = {};
//     try {
//         data = event.data.json();
//     } catch (e) {
//         data = {
//             title: "Notification",
//             body: "You have a new notification"
//         };
//     }

//     const title = data.title || "Notification";

//     const options = {
//         body: data.body || "",
//         icon: data.icon || "/logo-192.png",   // ✅ MAIN ICON
//         badge: data.badge || "/logo-72.png",     // ✅ STATUS BAR ICON (Android)
//         tag: data.tag || "default",
//         renotify: true,
//         vibrate: [200, 100, 200],
//         data: data.data || {}
//     };

//     event.waitUntil(
//         self.registration.showNotification(title, options)
//     );
// });

// public/sw.js

self.addEventListener("push", event => {
  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: "Notification", body: "You have a new notification" };
  }

  const title = data.title || "Trevion";

  const options = {
    body: data.body || "",
    icon: data.icon || "/logo-192.png",     // big icon
    badge: data.badge || "/logo-72.png",    // status bar icon
    tag: data.tag || "general",
    renotify: true,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/",                 // 🔥 dynamic redirect
      ...data.data
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// self.addEventListener("notificationclick", event => {
//     event.notification.close();

//     const payload = event.notification.data || {};
//     const crmUrl = (payload.origin || "/").replace(/\/$/, "");

//     // fallback safe open
//     event.waitUntil(
//         clients.openWindow(crmUrl)
//     );
// });

// self.addEventListener('notificationclick', event => {
//     event.notification.close();
//     const payload = event.notification.data || {};
//     const phone = payload.phone;
//     const crmUrl = (payload.origin || '/').replace(/\/$/, '');

//     // open autodial page directly
//     const urlWithPhone = `${crmUrl}/autodial?callPhone=${encodeURIComponent(phone || '')}&from=${encodeURIComponent(payload.initiatedBy || '')}`;
//     event.waitUntil(
//         clients.openWindow(urlWithPhone).catch(() => clients.openWindow(crmUrl))
//     );
// });