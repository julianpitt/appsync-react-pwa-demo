import { APICheck } from '../components/APICheck';
import ServiceWorkerSubscription from '../components/SWSubscription';
import WebSocketSubscription from '../components/WSsubscription';

export default function DashboardPage() {

  return (
    <div>
      <div className="container px-2 pb-8">
        <h1 className="text-xl py-3">Remote Browser Push Notifications</h1>
        <p>
          This section allows you to subscribe to messages from the admin and display them as browser push notifications
        </p>
        <p>
          These notifications persist even after you close this website.
        </p>
          <h2 className="text-l font-medium py-1 mt-3">Status</h2>
        <APICheck>
          <ServiceWorkerSubscription />
        </APICheck>
      </div>
      <div className="container px-2 pb-8">
        <h1 className="text-xl py-3">Remote In-App Notifications</h1>
        <p>
          This section allows you to subscribe to messages from the admin and display them as in-app push notifications
        </p>
        <p>
          These notifications will only be delivered while this website is open as they use websocket connections.
        </p>
        <h2 className="text-l font-medium py-1 mt-3">Status</h2>
        <WebSocketSubscription />
      </div>     
    </div>
  );
}
