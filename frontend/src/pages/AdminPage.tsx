import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import { useApi } from '../hooks/useApi';
import UserGroups from '../../../shared/groups';
import * as React from 'react';
import { toast } from 'react-toastify';

export default function AdminPage() {
  const [title, setTitle] = useState('Hello World!');
  const [body, setBody] = useState<string>('');
  const [icon, setIcon] = useState<string>('');
  const [groups, setGroups] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  async function sendNotifications(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const api = useApi();

      await api.SendNotification({
        input: {
          body,
          icon,
          title,
          userPoolGroups: groups
        }
      });

    } catch (e) {
      toast('Api call failed', {type: 'error'});
      console.error(e);
    }
  }

  function handleGroupToggle(e: React.ChangeEvent<HTMLInputElement>) {
    const {value, checked} = e.currentTarget;
    if(checked) {
      setGroups((currentGroups) => [...currentGroups, value]);
    } else {
      setGroups((currentGroups) => currentGroups.filter((g) => g !== value));
    }
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-xl px-4 py-3">Send Notifications</h1>
      <form className="container px-2 py-3" onSubmit={sendNotifications}>
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
              <p>none</p>
              <input
                type="radio"
                name="notification-icon"
                value=""
                checked={icon === ''}
                onChange={() => setIcon('')}
              />
            </label>
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
        <div className="flex px-4 gap-4 py-5 flex-col">
          <label htmlFor="notification-groups" className="font-bold">
            Groups
          </label>
          <div className="flex px-4 gap-4 py-5 flex-row">
            {UserGroups.map(groupName => {
              return (
                <label key={groupName} className="flex-1 flex items-center justify-center flex-col gap-4">
                  <p>{groupName}</p>
                  <input
                    type="checkbox"
                    name="notification-groups"
                    value={groupName}
                    checked={groups?.includes(groupName)}
                    onChange={handleGroupToggle}
                  />
                </label>
              )
            })}
          </div>
        </div>
        <Button isLoading={sending} type="submit">{sending ? 'Sending...' : 'Send notifications'}</Button>
      </form>
    </div>
  );
}
