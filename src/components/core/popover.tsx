import { InfoCircledIcon } from "@radix-ui/react-icons";
import * as RadixPopover from "@radix-ui/react-popover";
import { styled, keyframes } from "../../theme";

const slideDownAndFade = keyframes({
  "0%": {
    transform: "translateY(-10px)",
    opacity: 0,
  },
  "100%": {
    transform: "translateY(0)",
    opacity: 1,
  },
});

const slideUpAndFade = keyframes({
  "0%": {
    transform: "translateY(10px)",
    opacity: 0,
  },
  "100%": {
    transform: "translateY(0)",
    opacity: 1,
  },
});

const slideRightAndFade = keyframes({
  "0%": {
    transform: "translateX(10px)",
    opacity: 0,
  },
  "100%": {
    transform: "translateX(0)",
    opacity: 1,
  },
});

const slideLeftAndFade = keyframes({
  "0%": {
    transform: "translateX(-10px)",
    opacity: 0,
  },
  "100%": {
    transform: "translateX(0)",
    opacity: 1,
  },
});

export const Content = styled(RadixPopover.Content, {
  borderRadius: "4px",
  padding: "20px",
  width: "260px",
  backgroundColor: "white",
  boxShadow: `"hsl(206 22% 7% / 35%) 0px 10px 38px -10px", "hsl(206 22% 7% / 20%) 0px 10px 20px -15px"`,
  willChange: "transform, opacity",
  "&:focus": {
    boxShadow:
      "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px, 0 0 0 2px $colors$violet11",
  },
  "&[data-state='open'][data-side='top']": {
    animation: `${slideDownAndFade} 400ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  "&[data-state='open'][data-side='right']": {
    animation: `${slideLeftAndFade} 400ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  "&[data-state='open'][data-side='bottom']": {
    animation: `${slideUpAndFade} 400ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  "&[data-state='open'][data-side='left']": {
    animation: `${slideRightAndFade} 400ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
});

export const Arrow = styled(RadixPopover.Arrow, {
  fill: "white",
});

export const Trigger = styled(RadixPopover.Trigger, {
  display: "inline-block",
});

export const Close = styled("button", {
  fontFamily: "inherit",
  borderRadius: "100%",
  height: "25px",
  width: "25px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--violet11)",
  position: "absolute",
  top: "5px",
  right: "5px",
  "&:hover": {
    backgroundColor: "red",
  },
  "&:focus": {
    boxShadow: "0 0 0 2px red",
  },
});

export const Root = RadixPopover.Root;
export const Portal = RadixPopover.Portal;

const IconTriggerButton = styled("button", {
  all: "unset",
  cursor: "pointer",
  display: "inline-block",
});
export const InfoTrigger = () => (
  <Trigger asChild={true}>
    <IconTriggerButton>
      <InfoCircledIcon />
    </IconTriggerButton>
  </Trigger>
);
