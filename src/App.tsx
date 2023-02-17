import "./App.css";
import AboutUsPage from "./pages/about-us";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route>
          <Route path="/" element={<AboutUsPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
