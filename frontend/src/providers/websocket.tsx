import { API, Auth, graphqlOperation } from "aws-amplify";
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {toast} from 'react-toastify';
import { InAppNotificationsDocument, InAppNotificationsSubscription } from "../api/graphql";
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/auth';
import { GraphQLSubscription } from '@aws-amplify/api';

/*
The websocket needs to be open at the top level so we don't lose the socket connection between different routes
We will use the WSSubscription component to control the application level web socket status
*/

type WebsocketContextProps = {
  subscribe: () => void;
  unsubscribe: () => void;
  toggleSubscription: () => void;
  loading: boolean;
  registered: boolean;
};

export const WebsocketContext = createContext<WebsocketContextProps>({
  subscribe: () => {
    console.log('subscribe is not implemented');
  },
  unsubscribe: () => {
    console.log('unsubscribe is not implemented');
  },
  toggleSubscription: () => {
    console.log('toggleSubscription is not implemented');
  },
  registered: false,
  loading: false,
});

export function WebsocketProvider(props: { children: ReactNode }) {
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [observable, setObservable] = useState<ZenObservable.Subscription | undefined>();

  useEffect(() => { return () => {
    if(observable) {
      observable.unsubscribe();
    }
  }}, [])

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
     
      toast('Registered to in-app notifications', {type: 'success'});

      setRegistered(true);
    } catch (e) {
      toast('Register error', {type: 'error'});
      console.error(e);
    }
  }

  async function unsubscribe() {
    try {
      if(observable) {
        observable.unsubscribe();
      }
     
      toast('Unregistered from in-app notifications', {type: 'success'});
      setRegistered(false);
    } catch (e) {
      console.error(e);
      toast('Unregister error', {type: 'error'});
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
  
  function handleMessage(input: InAppNotificationsSubscription) {
    if(input.inAppNotifications) {
      toast(input.inAppNotifications.title, {type: 'info'});
    }
  }

  return (
    <WebsocketContext.Provider value={{ subscribe, unsubscribe, toggleSubscription, loading, registered }}>
      {props.children}
    </WebsocketContext.Provider>
  );
}

export function useWSNotifications() {
  return useContext(WebsocketContext);
}