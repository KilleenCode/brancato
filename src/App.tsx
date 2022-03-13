import Config from "./Config";
import Omnibar from "./components/Omnibar/Omnibar";

function App() {
  const settingsPage = window.location.pathname === "/settings";

  return (
    <>
      {settingsPage && <Config />}

      {!settingsPage && <Omnibar />}
    </>
  );
}

export default App;
