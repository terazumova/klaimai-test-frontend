import "./App.css";
import AboutUsPage from "./pages/about-us";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route>
          <Route path="/" element={<AboutUsPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
