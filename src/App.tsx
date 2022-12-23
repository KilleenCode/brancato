import Config from "./Config";
import Omnibar from "./components/Omnibar/Omnibar";
import { globalStyles } from "./theme";

function App() {
  const settingsPage = window.location.pathname === "/settings";
  globalStyles();
  return (
    <>
      {settingsPage && <Config />}

      {!settingsPage && <Omnibar />}
    </>
  );
}

export default App;
