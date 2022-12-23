import { styled } from "../../theme";
import { inputSpacing } from "./input";

export const Button = styled("button", inputSpacing, {
  display: "inline-flex",
  gap: "4px",
  alignItems: "center",
  cursor: "pointer",
  reset: "all",
  fontWeight: "500",
  fontSize: "0.8rem",
  "&:disabled": {
    opacity: 0.5,
    cursor: "default",
  },

  variants: {
    appearance: {
      primary: {
        color: "$white",
        backgroundColor: "$violet9",
        border: "1px solid $violet7",
        "&:hover, &:focus": {
          backgroundColor: "$violet10",
        },
        "&:active": {
          backgroundColor: "$violet10",
        },
      },
      secondary: {
        color: "$violet11",
        backgroundColor: "$violet3",
        border: "1px solid $violet7",
        "&:hover, &:focus": {
          backgroundColor: "$violet4",
        },
        "&:active": {
          backgroundColor: "$violet5",
        },
      },
      success: {
        color: "$white",
        backgroundColor: "$grass9",
        border: "1px solid $grass7",
        "&:hover, &:focus": {
          backgroundColor: "$grass10",
        },
        "&:active": {
          backgroundColor: "$grass10",
        },
      },
      danger: {
        color: "$tomato11",
        backgroundColor: "$tomato3",
        border: "1px solid $tomato7",
        "&:hover, &:focus": {
          backgroundColor: "$tomato4",
        },
        "&:active": {
          backgroundColor: "$tomato5",
        },
      },
    },
    size: {
      small: {
        fontSize: "0.8rem",
        height: "28px",
        "& svg": {
          maxHeight: "20px",
          maxWidth: "20px",
        },
      },
      medium: {
        fontSize: "1rem",
        height: "36px",
        "& svg": {
          maxHeight: "20px",
          maxWidth: "20px",
        },
      },
    },
  },
  defaultVariants: {
    appearance: "primary",
    size: "medium",
  },
});

export const ButtonContainer = styled("div", {
  display: "flex",
  paddingTop: "0.5rem",
  paddingBottom: "0.5rem",
  gap: "8px",
  variants: {
    layout: {
      pills: {
        gap: 0,
        [`${Button}`]: {
          borderRadius: 0,
        },
        [`${Button} + ${Button}:not(:last-child)`]: {
          borderLeft: "1px solid $mauve9",
        },
        [`${Button}:first-child`]: {
          borderTopLeftRadius: "8px",
          borderBottomLeftRadius: "8px",
        },
        [`${Button}:last-child`]: {
          borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
          borderLeft: 0,
        },
      },
    },
    align: {
      start: { justifyContent: "start" },
      center: { justifyContent: "center" },
      end: { justifyContent: "end" },
    },
  },
  defaultVariants: {
    align: "end",
  },
});
export default Button;
