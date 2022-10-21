type Subscription = {
  endpoint: string;
  authKeys: {
    auth: string;
    p256dh: string;
  };
  userPoolGroup: string;
  userId: string;
};
