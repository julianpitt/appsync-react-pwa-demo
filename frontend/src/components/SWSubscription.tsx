import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import Button from "./Button";
import {toast} from 'react-toastify';

function urlBase64ToUint8Array(base64String: string) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function ServiceWorkerSubscription() {
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  if(!('serviceWorker' in navigator)) {
		return <p>Service Workers not supported</p>;
	}

  useEffect(() => {
    getUserSubscriptionStatus();
  }, []);

  async function getUserSubscriptionStatus() {
    setLoading(true);

    try {
      const swReg = await getServiceWorkerRegistration();
      if(!swReg) {
        setRegistered(false);
        setLoading(false);
        return; 
      }
      
      const api = useApi();
      const user =  await Auth.currentAuthenticatedUser();
      let groups = user.signInUserSession.accessToken.payload["cognito:groups"]
      groups = groups.filter((g:string) => g !== 'admin');

      if(!groups) throw new Error("user is not part of a group");
      
      const subscriptions = await api.GetUserSubscriptions();

      for(const sub of subscriptions.getUserSubscriptions) {
        if(sub.endpoint === swReg.endpoint) {
          setRegistered(true);
          break;
        }
      }
    } catch (e) {
      console.error(e);
      console.log('error occured')
    }
    setLoading(false);
  }

  async function getServiceWorkerRegistration() {
    const swReg = await navigator.serviceWorker.ready;
    return swReg.pushManager.getSubscription();
  }
  
  async function subscribe() {
    const swReg = await navigator.serviceWorker.ready;
    const api = useApi();
    // get from method below
		const vapidPublicKey = process.env.VAPID_PUBLIC_KEY!;
		const convertedPublicKey = urlBase64ToUint8Array(vapidPublicKey);

    try {
      const newSubscription = await swReg.pushManager.subscribe({
        userVisibleOnly: true, // push notificaitons sent through our server are only visible to this user
        applicationServerKey: convertedPublicKey
      });

      const subscriptionJSON = newSubscription.toJSON();

      await api.SubscribeToNotifications({
        input: {
          endpoint: subscriptionJSON.endpoint!,
          keys: {
            auth: subscriptionJSON.keys!.auth!,
            p256dh: subscriptionJSON.keys!.p256dh!
          }
        }
      });

      toast('Subscribed', {type: 'success'});

      setRegistered(true);
    } catch (e) {
      toast('Subscribe error', {type: 'error'});
      console.error(e);
    }
  }

  async function unsubscribe() {
    try {
      const api = useApi();
      const subscription = await getServiceWorkerRegistration();

      await api.UnsubscribeToNotifications({
        input: {
          endpoint: subscription!.endpoint
        }
      });

      const reg = await getServiceWorkerRegistration();
      const result = await reg!.unsubscribe();
      if(result !== true) {
        console.log('unsubscribe unsuccessful')
      }
      
      toast('Unsubscribed', {type: 'success'});
      setRegistered(false);
    } catch (e) {
      console.error(e);
      toast('Unsubscribe error', {type: 'error'});
    }
  }

  async function toggleSubscription() {
    if(loading) { return; }

    setLoading(true);
    try {
      if(registered) { 
        await unsubscribe(); 
      } else {
        await subscribe();
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  return loading ? <p>Checking status...</p> : (
    <>
      <p className="mb-2">
        {registered ? 'You are currently registered' : 'You are currently unregistered'} to Browser notifications
      </p>
      <Button onClick={toggleSubscription} isLoading={loading}>
        {loading ? 'Loading...' : registered ? 'Unregister' : 'Register'}
      </Button>
    </>
    )
  
}