import { useEffect } from "react";

const useWarningOnExit = (
  shouldWarn: boolean,
  message = "Are you sure that you want to leave?"
) => {
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldWarn) {
        const event = e || window.event;
        event.returnValue = message;
        return message;
      }
      return null;
    };

    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [message, shouldWarn]);
};

export default useWarningOnExit;
