import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {useState, useEffect} from "react";
import SignUp from "./components/UserManagement/signup";
import Login from "./components/UserManagement/login";
import Login2 from "./components/UserManagement/login2";
import Login3 from "./components/UserManagement/login3";
import HomePage from "./components/HomePage";
import HotelHomepage from "./components/HotelHomepage";
import TourOperatorHomePage from "./components/TourOperatorHomePage";
import AddRoom from "./components/AddRoom";
import AvailableRooms from "./components/AvailableRooms";
import RoomBooking from "./components/RoomBooking";
import OrderFood from "./components/OrderFood";
import ProvideFeedback from "./components/ProvideFeedback";
import AddTour from "./components/AddTour";
import RequestTour from "./components/RequestTour";
import TourBooking from "./components/TourBooking";
import FeedbackAnalysis from "./components/FeedbackAnalysis";
import Visualize from "./components/Visualize";
import VisualizeRoom from "./components/VisualizeRoom";
import VisualizeIncomeProfit from "./components/VisualizeIncomeProfit";
import VisualizeFoodOrder from "./components/VisualizeFoodOrder";
import UserStatistics from "./components/UserStatistics";
import './App.css';

// const PrivateRoute = ({ children }) => {
//   const [cookie] = useCookies(["Token"]);
//   return !!cookie.Token ? children : <Navigate to="/login" replace={true} />;
// };

// const PublicRoute = ({ children }) => {
//   const [cookie] = useCookies(["Token"]);
//   return !!cookie.Token ? <Navigate to="/" replace={true} /> : children;
// };


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/hotel" element={<HotelHomepage/>} />
        <Route path="/addrooms" element={<AddRoom/>} />
        <Route path="/viewfeedbackanalysis" element={<FeedbackAnalysis/>} />
        <Route path="/visualize" element={<Visualize/>} />
        <Route path="/visualizeroom" element={<VisualizeRoom/>} />
        <Route path="/visualizeincomeprofit" element={<VisualizeIncomeProfit/>} />
        <Route path="/visualizefoodorder" element={<VisualizeFoodOrder/>} />
        <Route path="/userstatistics" element={<UserStatistics/>} />
        <Route path="/availablerooms" element={<AvailableRooms/>} />
        <Route path="/bookroom/:id" element={<RoomBooking/>} />
        <Route path="/orderfood" element={<OrderFood/>} />
        <Route path="/tours" element={<RequestTour/>} />
        <Route path="/booktour/:id" element={<TourBooking/>} />
        <Route path="/providefeedback" element={<ProvideFeedback/>} />
        <Route path="/touroperator" element={<TourOperatorHomePage/>} />
        <Route path="/addtour" element={<AddTour/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login2" element={<Login2 />} />
        <Route path="/login3" element={<Login3 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
