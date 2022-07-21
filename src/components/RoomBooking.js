// This component allows the Restaurant user to post excess food request.

import { useState, useEffect, React } from "react";
import { Form, Button } from "react-bootstrap";
import HomeHeader from "./HomeHeader";
import { useCookies } from "react-cookie";
import DatePicker from "react-datepicker";
import { Navigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
const axios = require("axios");

const DEF_ITEM_DETAILS = {
    fromDate: new Date(),
    toDate: new Date(),
    adults: "",
    children: ""
}

const RoomBooking = () => {
    const navigate = useNavigate();
    const [room, setRoom]= useState();
    const [userEmail, setUserEmail] = useState();
  const [inputRoomBookingDetails, setInputRoomBookingFoodDetails] = useState(DEF_ITEM_DETAILS);
  const [cookies, setCookies] = useCookies(["RoomNumber"]);

  
  const params = useParams();

  useEffect(() => {
    const userEmail = cookies.Email;
    if (userEmail!== null) {
        setUserEmail(userEmail);
    }
    setRoom(params.id);
    //console.log(params.id);
    console.log(room);
  }, [1]);

  //Function to store the entered values in local variables depending on the input field
  const inputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    switch (name) {
      case "fromDate":
        setInputRoomBookingFoodDetails({
          ...inputRoomBookingDetails,
          [name]: value,
        });
        break;

      case "toDate":
        setInputRoomBookingFoodDetails({
          ...inputRoomBookingDetails,
          [name]: value,
        });
        break;

      case "adults":
        setInputRoomBookingFoodDetails({
          ...inputRoomBookingDetails,
          [name]: value,
        });
        break;

    case "children":
        setInputRoomBookingFoodDetails({
           ...inputRoomBookingDetails,
            [name]: value,
        });
        break;

      default:
        break;
    }
  };

  //Function to call the POST API to store the food request details into the database on clicking Submit button.
  const handleBookRoomSubmit = (e) => {
    e.preventDefault();
    //const userId = JSON.parse(localStorage.getItem("user"))._id;
    console.log(setInputRoomBookingFoodDetails);

    axios
      .post("https://us-central1-assignment4-355202.cloudfunctions.net/room-booking", {
        roomnumber: room.toString(),
        userEmail: userEmail,
        fromDate: inputRoomBookingDetails.fromDate,
        toDate: inputRoomBookingDetails.toDate,
        adults: inputRoomBookingDetails.adults,
        children: inputRoomBookingDetails.children,
      })
      .then((response) => {           
            Swal.fire({
              icon: "success",
              title: "Room booking is successful",
              text: "Press OK to order some food",
            }).then(() => {
              navigate("/orderfood");
            })
      }
    ).catch((err) => {
      console.log(err);
      Swal.fire({
        icon: "warning",
        title: "There is already a room with this user id",
        text: "Press OK to order some food",
      }).then(() => {
        navigate("/orderfood");
      })
  }) 
  };

  return (
    <div>
       <HomeHeader />
    
    <div className="container mt-2">
     
      <center className="mt-2">
        <h3> Book room</h3>
      </center>
      <Form className="mt-4 border border-primary">
        <div className="form-group green-border-focus m-3 p-3">
          <label htmlFor="exampleFormControlTextarea5">From date</label>
          <DatePicker selected={inputRoomBookingDetails.fromDate} className="form-control" type="text" name="fromDate" onChange={inputChange} placeholderText={'From'} />
        </div>
        <div className="form-group m-3 p-3">
          <label>To date</label>
          <DatePicker selected={inputRoomBookingDetails.toDate} className="form-control" type="text" name="toDate" onChange={inputChange} placeholderText={'From'} />
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
          <Button className = "mb-2" variant="success" onClick={handleBookRoomSubmit}>
            Book room
          </Button>
        </center>
      </Form>
    </div>
    </div>
  );
};

export default RoomBooking;
