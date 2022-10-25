import { API, Auth, graphqlOperation } from "aws-amplify";
import { useEffect, useState } from "react";
import Button from "./Button";
import {toast} from 'react-toastify';
import { InAppNotificationsDocument, InAppNotificationsSubscription } from "../api/graphql";
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/auth';
import { GraphQLSubscription } from '@aws-amplify/api';

export default function WebSocketSubscription() {
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [observable, setObservable] = useState<ZenObservable.Subscription | undefined>();

  useEffect(() => { return () => {
    if(observable) {
      observable.unsubscribe();
    }
  }}, [])

  function handleMessage(input: InAppNotificationsSubscription) {
    if(input.inAppNotifications) {
      toast(input.inAppNotifications.title, {type: 'info'});
    }
  }

  async function subscribe() {
    const creds = await Auth.currentSession();
    try {
      const subscription = API.graphql<GraphQLSubscription<InAppNotificationsSubscription>>(
        {
          // @ts-expect-error type is subscription observable
          query: InAppNotificationsDocument,
          authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
        }, {
          Authorization: creds.getIdToken().getJwtToken()
        }
      ).subscribe({
        next: (data) => {
          if(data.value.data) {
            handleMessage(data.value.data)
          } 
        },
        error: (error: any) => console.error(error)
      });

      setObservable(subscription);
     
      toast('Subscribed', {type: 'success'});

      setRegistered(true);
    } catch (e) {
      toast('Subscribe error', {type: 'error'});
      console.error(e);
    }
  }

  async function unsubscribe() {
    try {
      if(observable) {
        observable.unsubscribe();
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

  return(
    <Button onClick={toggleSubscription} isLoading={loading}>
      {loading ? 'Loading...' : registered ? 'Hide in app' : 'Show in app'}
    </Button>
  )
}