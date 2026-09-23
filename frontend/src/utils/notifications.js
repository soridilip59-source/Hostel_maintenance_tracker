export const notify = ({ type = "info", message = "" }) => {
  window.dispatchEvent(
    new CustomEvent("app:toast", {
      detail: { type, message },
    })
  );
};
