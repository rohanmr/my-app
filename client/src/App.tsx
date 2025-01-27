import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { ToastContainer } from "react-toastify";
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <div>
      <ToastContainer theme="colored" />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
