import { useWSNotifications } from "../providers/websocket";
import Button from "./Button";

export default function WebSocketSubscription() {
  const {loading, registered, toggleSubscription } = useWSNotifications();

  return loading ? <p>Checking status...</p> : (
    <>
      <p className="mb-2">
        {registered ? 'You are currently registered' : 'You are currently not registered'} for In-App notifications
      </p>
      <Button onClick={toggleSubscription} isLoading={loading}>
      {loading ? 'Loading...' : registered ? 'Unregister' : 'Register'}
    </Button>
    </>
  )
}