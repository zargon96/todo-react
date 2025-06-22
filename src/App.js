import Index from "./components/Index";
import "../src/styles/App.css";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <div className="App">
        <Index />
      </div>
    </AppProvider>
  );
}

export default App;
