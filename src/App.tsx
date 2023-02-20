import "./App.css";
import AboutUsPage from "./pages/about-us";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route>
          <Route path="/" element={<AboutUsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
