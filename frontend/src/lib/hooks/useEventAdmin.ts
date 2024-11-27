import { useBackendUserStore } from "@stores/useBackendUserStore";
import { useEffect, useState } from "react";

function useEventAdmin(eventId: string | number | undefined) {
  const [isEventAdmin, setIsEventAdmin] = useState<boolean>(false);
  const { backendUser, userAdminEvents } = useBackendUserStore();

  useEffect(() => {
    if (isEventAdmin === true) {
      return;
    }
    if (eventId === undefined) {
      return;
    }

    if (backendUser !== null) {
      if (backendUser.is_admin === true) {
        setIsEventAdmin(true);
      }
    }
    if (userAdminEvents.has(Number(eventId))) {
      setIsEventAdmin(true);
    }
  }, [backendUser, userAdminEvents, eventId]);

  return { isEventAdmin };
}

export default useEventAdmin;
