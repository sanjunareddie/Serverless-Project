// This component allows the Restaurant user to post excess food request.

import { useState, useEffect, React } from "react";
import { Form, Button } from "react-bootstrap";
import HomeHeader from "./HomeHeader";
import { useCookies } from "react-cookie";
import LexChat from "react-lex-plus";
import DatePicker from "react-datepicker";
import { Navigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import bgimage from "../images/bg1.jpg";
const axios = require("axios");

const DEF_ITEM_DETAILS = {
    adults: "",
    children: ""
}

const RoomBooking = () => {
    const navigate = useNavigate();
    const [room, setRoom]= useState();
    const [userType, setUserType] = useState();
    const [userEmail, setUserEmail] = useState();
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
  const [inputRoomBookingDetails, setInputRoomBookingFoodDetails] = useState(DEF_ITEM_DETAILS);
  const [cookies, setCookies] = useCookies(["Email", "userType"]);

  
  const params = useParams();

  useEffect(() => {
    const userEmail = cookies.Email;
    const userType = cookies.userType;
    if (userEmail!== null) {
        setUserEmail(userEmail);
    }
    if (userType!== null) {
      setUserType(userType);
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
    console.log(room);
    if(userType === "customer") {
      axios
      .post("https://us-central1-serverless-a2-352802.cloudfunctions.net/room_booking", {
        roomnumber: room.toString(),
        userEmail: userEmail,
        fromDate: fromDate,
        toDate: toDate,
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
    }
    else {
      Swal.fire({
        icon: "warning",
        title: "Kindly login to book a room",
        text: "Press OK",
      }).then(() => {
        navigate("/login");
      })
    }
    
  };

  return (
    <>
      <div className='container-fluid homeimage' style={{ backgroundImage: `url(${bgimage})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", paddingBottom: "10%" }}>
       <HomeHeader />
    
    <div className="container mt-2">
     
      <center className="mt-2">
        <h3> Book room</h3>
      </center>
      <Form className="bg-white p-4 mb-5 border">
        <div className="form-group green-border-focus m-3 p-3">
          <label htmlFor="exampleFormControlTextarea5">From date</label>
          <DatePicker selected={fromDate} className="form-control" onChange={(date) => setFromDate(date)} placeholderText={'From'} />
        </div>
        <div className="form-group m-3 p-3">
          <label>To date</label>
          <DatePicker selected={toDate} className="form-control" onChange={(date) => setToDate(date)} placeholderText={'To'} />
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
    </div></div>
    {userType === "customer" ? (
            <LexChat
            botName="BreadBreakfastbookroom"
            IdentityPoolId="us-east-1:9ae37937-66a0-4c57-914d-abd9db5bb5a9"
            placeholder="Placeholder text"
            backgroundColor="#FFFFFF"
            height="430px"
            region="us-east-1"
            headerText="Welcome to Bed and Breakfast Serverless Chat bot"
            headerStyle={{ backgroundColor: "#0d6efd", fontSize: "30px" }}
          
        />
        ) : null}
    </>
  );
};

export default RoomBooking;
