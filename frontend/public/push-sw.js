self.addEventListener("push", (event) => {
  const options = {
    icon: "texting-app-icon_192x192.png",
  };
  let title = "New notification";

  const data = event?.data?.json();
  if (data?.type === "message") {
    if (data?.sender) {
      title = data.sender;
      options.icon = data?.senderProfileImage;
    }
    options.body = data?.content?.messageText;
    options.timestamp = data?.content?.timestamp;
    options.tag = data?.senderId;
  }
  const notificationPromise = self?.registration?.showNotification(
    title,
    options
  );
  if (notificationPromise) {
    event?.waitUntil(notificationPromise);
  }
});

self.addEventListener("notificationclick", (event) => {
  event?.notification?.close();
  event?.waitUntil(clients?.openWindow("/"));
});
