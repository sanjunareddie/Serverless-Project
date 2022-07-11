import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import SignUp from "./components/UserManagement/signup";
import Login from "./components/UserManagement/login";
import Login2 from "./components/UserManagement/login2";
import Login3 from "./components/UserManagement/login3";

import './App.css';

const PrivateRoute = ({ children }) => {
  const [cookie] = useCookies(["Token"]);
  return !!cookie.Token ? children : <Navigate to="/login" replace={true} />;
};

const PublicRoute = ({ children }) => {
  const [cookie] = useCookies(["Token"]);
  return !!cookie.Token ? <Navigate to="/" replace={true} /> : children;
};


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
        <Route path="/login2" element={<PublicRoute><Login2 /></PublicRoute>} />
        <Route path="/login3" element={<PublicRoute><Login3 /></PublicRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
