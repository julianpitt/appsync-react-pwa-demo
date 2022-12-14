import { useState } from 'react';
import Button from '../components/Button';
import {toast} from 'react-toastify';
import { APICheck } from '../components/APICheck';

export default function LocalTestPage() {
  const [title, setTitle] = useState('Hello World!');
  const [body, setBody] = useState<string | undefined>();
  const [icon, setIcon] = useState<string | undefined>();


  function displayLocalNotification() {
    console.log('displaying notification')
    new Notification(title, { body, icon });
  }

  function displayInAppNotification() {
    console.log('displaying in app notification')
    toast(title);
  }

  return (
    <APICheck>
      <div className="container mx-auto">
        <div className="container px-2 pb-8">
          <h1 className="text-xl py-3">Local Browser Notifications Test</h1>
          <p>This section let's you try out the notification options available in this app. Notifications sent in this section do not get sent over the network</p>
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
          <Button onClick={displayLocalNotification}>Display as Browser Notification</Button>
          <Button onClick={displayInAppNotification}>Display as In-app notification</Button>
        </div>
      </div>
    </APICheck>
  );
}
