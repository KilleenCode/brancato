import { css, styled } from "../../theme";

export const inputSpacing = css({
  height: "35px",
  borderRadius: "8px",
  paddingLeft: "0.8rem",
  paddingRight: "0.8rem",
});

export const InputContainer = styled("div", {
  marginBottom: "1rem",
});

export const InputLabel = styled("label", {
  display: "block",
  fontSize: "1.2rem",
});

export const Input = styled("input", inputSpacing, {
  maxWidth: "250px",
  border: "0",
});
