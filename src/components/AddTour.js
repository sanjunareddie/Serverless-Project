import { useState, React } from "react";
import { Form, Button } from "react-bootstrap";
import HomeHeader from "./HomeHeader";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router";
const axios = require("axios");

const DEF_ITEM_DETAILS = {
    tourid: "",
    tourname: "",
    description: "",
    duration: "",
    price: "",
}

const AddTour = () => {
    const navigate = useNavigate();
  const [tourDetails, setTourDetails] = useState(DEF_ITEM_DETAILS);

  const inputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    switch (name) {
        case "tourid":
            setTourDetails({
              ...tourDetails,
              [name]: value,
            });
            break;

      case "tourname":
        setTourDetails({
          ...tourDetails,
          [name]: value,
        });
        break;
      
        case "description":
        setTourDetails({
          ...tourDetails,
          [name]: value,
        });
        break;

      case "duration":
        setTourDetails({
          ...tourDetails,
          [name]: value,
        });
        break;
    
        case "price":
            setTourDetails({
          ...tourDetails,
          [name]: value,
        });
        break;

      default:
        break;
    }
  };

  const handleAddTourSubmit = (e) => {
    e.preventDefault();
    console.log(tourDetails);

    axios
      .post("https://us-central1-assignment4-355202.cloudfunctions.net/add-tour", {
        tourid: tourDetails.tourid,
        tourname: tourDetails.tourname,
        description: tourDetails.description,
        duration: tourDetails.duration,
        price: tourDetails.price
      })
      .then((res) => {
        alert("Tour added successfully.");
        navigate("/touroperator");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.response);
        alert("error");
      }); 
  };

  return (
    <div>
       <HomeHeader />
    
    <div className="container mt-2">
     
      <center className="mt-2">
        <h3> Add a tour</h3>
      </center>
      <Form className="mt-4 border border-primary">
      <div className="form-group m-3 p-3">
          <label>Tour ID</label>
          <input
            className="form-control"
            type="text"
            name="tourid"
            placeholder="Enter Tour ID"
            onChange={inputChange}
          />
        </div>
        <div className="form-group m-3 p-3">
          <label>Tour name</label>
          <input
            className="form-control"
            type="text"
            name="tourname"
            placeholder="Enter Tour name"
            onChange={inputChange}
          />
        </div>
        <div className="form-group m-3 p-3">
          <label>Tour Description</label>
          <input
            className="form-control"
            type="text"
            name="description"
            placeholder="Enter tour description"
            onChange={inputChange}
          />
        </div>
        <div className="form-group m-3 p-3">
          <label>Duration</label>
          <input
            className="form-control"
            type="text"
            name="duration"
            placeholder="Enter duration"
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
          <Button className = "mb-2" variant="success" onClick={handleAddTourSubmit}>
            Add tour
          </Button>
        </center>
      </Form>
    </div>
    </div>
  );
};

export default AddTour;
