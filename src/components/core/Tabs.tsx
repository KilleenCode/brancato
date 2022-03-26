import * as Tabs from "@radix-ui/react-tabs";
import { styled } from "../../theme";

export const TabTrigger = styled(Tabs.Trigger, {
  reset: "all",
  cursor: "pointer",
  background: "$mauve1",
  color: "white",
  border: "1px solid grey",
  fontSize: "1rem",
  padding: "0.8rem",
  borderBottom: 0,

  "&[aria-selected='true']": {
    background: "$mauve2",
  },
});

export const TabTriggerContainer = styled(Tabs.List, {
  [`${TabTrigger}:first-child`]: {
    borderTopLeftRadius: "8px",
  },
  [`${TabTrigger}:last-child`]: {
    borderTopRightRadius: "8px",
  },
});

export const TabContent = styled(Tabs.Content, {
  background: "$mauve2",
  padding: "1rem",
  border: "1px solid grey",
  borderTop: 0,
});

export const TabContainer = styled(Tabs.Root, {});
