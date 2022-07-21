import { useState, React } from "react";
import { Form, Button } from "react-bootstrap";
import HomeHeader from "./HomeHeader";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router";
const axios = require("axios");

const DEF_ITEM_DETAILS = {
    roomnumber: "",
    fromDate: new Date(),
    toDate: new Date(),
    roomType: "",
    bedrooms: "",
    price: "",
}

const AddRoom = () => {
    const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState(DEF_ITEM_DETAILS);

  const inputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    switch (name) {
        case "roomnumber":
            setRoomDetails({
              ...roomDetails,
              [name]: value,
            });
            break;

      case "fromDate":
        setRoomDetails({
          ...roomDetails,
          [name]: value,
        });
        break;

      case "toDate":
        setRoomDetails({
          ...roomDetails,
          [name]: value,
        });
        break;
    
        case "roomType":
        setRoomDetails({
          ...roomDetails,
          [name]: value,
        });
        break;

        case "price":
            setRoomDetails({
              ...roomDetails,
              [name]: value,
            });
            break;

        case "bedrooms":
        setRoomDetails({
          ...roomDetails,
          [name]: value,
        });
        break;

      default:
        break;
    }
  };

  const handleAddRoomSubmit = (e) => {
    e.preventDefault();
    console.log(setRoomDetails);

    axios
      .post("https://us-central1-assignment4-355202.cloudfunctions.net/add-room", {
        roomnumber: roomDetails.roomnumber,
        fromDate: roomDetails.fromDate,
        toDate: roomDetails.toDate,
        roomType: roomDetails.roomType,
        bedrooms: roomDetails.bedrooms,
        price: roomDetails.price,
      })
      .then((res) => {
        alert("Room added successfully.");
        navigate("/hotel");
        window.location.reload();
      });
  };

  return (
    <div>
       <HomeHeader />
    
    <div className="container mt-2">
     
      <center className="mt-2">
        <h3> Add a room</h3>
      </center>
      <Form className="mt-4 border border-primary">
      <div className="form-group m-3 p-3">
          <label>Room number</label>
          <input
            className="form-control"
            type="text"
            name="roomnumber"
            placeholder="Enter Room number"
            onChange={inputChange}
          />
        </div>
        <div className="form-group green-border-focus m-3 p-3">
          <label htmlFor="exampleFormControlTextarea5">From date</label>
          <DatePicker selected={roomDetails.fromDate} className="form-control" type="date" name="fromDate" onChange={inputChange} placeholderText={'From'} />
        </div>
        <div className="form-group m-3 p-3">
          <label>To date</label>
          <DatePicker selected={roomDetails.toDate} className="form-control" type="date" name="toDate" onChange={inputChange} placeholderText={'From'} />
        </div>
        <div className="form-group m-3 p-3">
          <label>Room type</label>
          <input
            className="form-control"
            type="text"
            name="roomType"
            placeholder="Enter Room type"
            onChange={inputChange}
          />
        </div>
        <div className="form-group m-3 p-3">
          <label>Number of bedrooms</label>
          <input
            className="form-control"
            type="text"
            name="bedrooms"
            placeholder="Enter number of bedrooms"
            onChange={inputChange}
          />
        </div>
        <div className="form-group m-3 p-3">
          <label>Price</label>
          <input
            className="form-control"
            type="text"
            name="price"
            placeholder="Enter price"
            onChange={inputChange}
          />
        </div>
        <center>
          <Button className = "mb-2" variant="success" onClick={handleAddRoomSubmit}>
            Add room
          </Button>
        </center>
      </Form>
    </div>
    </div>
  );
};

export default AddRoom;
