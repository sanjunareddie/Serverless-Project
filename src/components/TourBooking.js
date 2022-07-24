// This component allows the Restaurant user to post excess food request.

import { useState, useEffect, React } from "react";
import { Form, Button } from "react-bootstrap";
import HomeHeader from "./HomeHeader";
import { useCookies } from "react-cookie";
import DatePicker from "react-datepicker";
import LexChat from "react-lex-plus";
import { Navigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
const axios = require("axios");

const DEF_ITEM_DETAILS = {
    duration: "",
    adults: "",
    children: ""
}

const TourBooking = () => {
    const navigate = useNavigate();
    const [tourid, setTourId]= useState();
    const [userType, setUserType] = useState();
    const [userEmail, setUserEmail] = useState();
  const [inputTourBookingDetails, setInputTourBookingFoodDetails] = useState(DEF_ITEM_DETAILS);
  const [cookies, setCookies] = useCookies(["Customerid", "userType"]);

  
  const params = useParams();

  useEffect(() => {
    const userEmail = cookies.Customerid;
    const userType = cookies.userType;
    if (userEmail!== null) {
        setUserEmail(userEmail);
    }
    if (userType!== null) {
      setUserType(userType);
  }
    setTourId(params.id);
    //console.log(params.id);
    console.log(tourid);
  }, [1]);

  //Function to store the entered values in local variables depending on the input field
  const inputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    switch (name) {

      case "duration":
        setInputTourBookingFoodDetails({
          ...inputTourBookingDetails,
          [name]: value,
        });
        break;

      case "adults":
        setInputTourBookingFoodDetails({
          ...inputTourBookingDetails,
          [name]: value,
        });
        break;

    case "children":
      setInputTourBookingFoodDetails({
           ...inputTourBookingDetails,
            [name]: value,
        });
        break;

      default:
        break;
    }
  };

  //Function to call the POST API to store the food request details into the database on clicking Submit button.
  const handleBookTourSubmit = (e) => {
    e.preventDefault();
    //const userId = JSON.parse(localStorage.getItem("user"))._id;
    console.log(setInputTourBookingFoodDetails);

    axios
      .post("https://us-central1-assignment4-355202.cloudfunctions.net/book-tour", {
        tourid: tourid.toString(),
        userid: userEmail,
        duration: inputTourBookingDetails.duration,
        adults: inputTourBookingDetails.adults,
        children: inputTourBookingDetails.children,
      })
      .then((response) => {           
            Swal.fire({
              icon: "success",
              title: "Tour booking is successful",
              text: "Press OK to order some food",
            }).then(() => {
              navigate("/");
            })
      }
    ).catch((err) => {
      console.log(err);
      Swal.fire({
        icon: "warning",
        title: "There is already a tour booked with this user id",
        text: "Press OK to order some food",
      }).then(() => {
        navigate("/");
      })
  }) 
  };

  return (
    <div>
       <HomeHeader />
    
    <div className="container mt-2">
     
      <center className="mt-2">
        <h3> Book tour</h3>
      </center>
      <Form className="mt-4 border border-primary">
      <div className="form-group m-3 p-3">
          <label>Duration</label>
          <input
            className="form-control"
            type="text"
            name="duration"
            placeholder="Enter duration of tour"
            onChange={inputChange}
          />
        </div>
        <div className="form-group m-3 p-3">
          <label>Number of adults</label>
          <input
            className="form-control"
            type="text"
            name="adults"
            placeholder="Enter number of adults"
            onChange={inputChange}
          />
        </div>
        <div className="form-group m-3 p-3">
          <label>Number of children</label>
          <input
            className="form-control"
            type="text"
            name="children"
            placeholder="Enter number of children"
            onChange={inputChange}
          />
        </div>
        <center>
          <Button className = "mb-2" variant="success" onClick={handleBookTourSubmit}>
            Book tour
          </Button>
        </center>
      </Form>
    </div>
    </div>
  );
};

export default TourBooking;
