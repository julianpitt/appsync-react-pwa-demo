import { ReactNode, useState } from "react";
import Button from "./Button";

type APICheckProps = {
  children: JSX.Element;
}

export function APICheck(props: APICheckProps): JSX.Element {
  const notificationsAvailable = 'Notification' in window;
  const [enabled, setEnabled] = useState(
    () => notificationsAvailable && Notification.permission === 'granted',
  );

  async function allowNotifications() {
    try {
      const result = await Notification.requestPermission();
      if(result === 'granted') {
        setEnabled(true);
      } else {
        setEnabled(false);
      }
    } catch (e) {
      console.error(e);
      setEnabled(false);
    }
  }

  if (!notificationsAvailable) return <p>Notifications are not available in this browser</p>;
  if (Notification.permission === 'denied') {
    return (
      <p>
        Notifications have been denied, you will need to manually allow them for this browser and
        website then reload the page
      </p>
    );
  } else if (Notification.permission === 'default') {
    return (
      <div>
        <p>Please enable browser notifications</p>
        <Button onClick={allowNotifications}>
          {enabled ? 'Disable' : 'Enable'} Notifications
        </Button>
      </div>
    )
  } else {
    return props.children;
  }
  
};