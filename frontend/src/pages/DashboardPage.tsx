import { useState } from 'react';
import Button from '../components/Button';

export default function DashboardPage() {
  const notificationsAvailable = 'Notification' in window;
  const [enabled, setEnabled] = useState(
    () => notificationsAvailable && Notification.permission === 'granted',
  );
  const [title, setTitle] = useState('Hello World!');
  const [body, setBody] = useState<string | undefined>();
  const [icon, setIcon] = useState<string | undefined>();

  function allowNotifications() {
    try {
      Notification.requestPermission().then();
    } catch (e) {
      return false;
    }
    setEnabled(true);
    return true;
  }

  function displayLocalNotification() {
    new Notification(title, { body, icon });
  }

  if (!notificationsAvailable) return <p>Notifications are not available in this browser</p>;
  if (Notification.permission === 'denied')
    return (
      <p>
        Notifications have been denied, you will need not manually allow them for this browser and
        website then reload the page
      </p>
    );

  return (
    <div className="container mx-auto">
      {!enabled && (
        <div>
          <p>Please enable notifications</p>
          <Button onClick={allowNotifications}>
            {enabled ? 'Disable' : 'Enable'} Notifications
          </Button>
        </div>
      )}
      <h1 className="text-xl px-4 py-3">Notifications demo</h1>
      <div className="container px-2 py-3">
        <div className="flex px-4 gap-4 flex-col py-5">
          <label htmlFor="notification-title" className="font-bold">
            Title
          </label>
          <input
            type="text"
            id="notification-title"
            value={title}
            onChange={e => setTitle(e.currentTarget.value)}
          ></input>
        </div>
        <div className="flex px-4 gap-4 flex-col py-5">
          <label htmlFor="notification-body" className="font-bold">
            Body
          </label>
          <input
            type="text"
            id="notification-body"
            value={body}
            onChange={e => setBody(e.currentTarget.value)}
          ></input>
        </div>
        <div className="flex px-4 gap-4 py-5 flex-col">
          <label htmlFor="notification-icon" className="font-bold">
            Icon
          </label>
          <div className="flex px-4 gap-4 py-5 flex-row">
            <label className="flex-1 flex items-center justify-center flex-col gap-4">
              <img src="notification.png" className="w-12 h-12" />
              <input
                type="radio"
                name="notification-icon"
                value="notification.png"
                checked={icon === 'notification.png'}
                onChange={() => setIcon('notification.png')}
              />
            </label>
            <label className="flex-1 flex items-center justify-center flex-col gap-4">
              <img src="house.png" className="w-12 h-12" />
              <input
                type="radio"
                name="notification-icon"
                value="house.png"
                checked={icon === 'house.png'}
                onChange={() => setIcon('house.png')}
              />
            </label>
            <label className="flex-1 flex items-center justify-center flex-col gap-4">
              <img src="location.png" className="w-12 h-12" />
              <input
                type="radio"
                name="notification-icon"
                value="location.png"
                checked={icon === 'location.png'}
                onChange={() => setIcon('location.png')}
              />
            </label>
          </div>
        </div>
        <Button onClick={displayLocalNotification}>Display Local notification</Button>
      </div>
    </div>
  );
}
