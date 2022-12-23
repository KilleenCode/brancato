import { css, styled } from "../../theme";

export const inputSpacing = css({
  height: "35px",
  borderRadius: "8px",
  paddingLeft: "0.8rem",
  paddingRight: "0.8rem",
});

export const InputContainer = styled("div", {
  paddingTop: "1rem",
  paddingBottom: "1rem",
});

export const InputLabel = styled("label", {
  display: "block",
  fontWeight: "600",
  fontSize: "0.8rem",

  "&:has(input)": {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  "&:not(:has(input))": {
    paddingBottom: "4px",
  },
});

export const Input = styled("input", inputSpacing, {
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: "4px",
});
