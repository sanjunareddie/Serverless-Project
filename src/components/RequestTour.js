import { useState, useEffect, React } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import HomeHeader from "./HomeHeader";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router";
import "../../src/index.css";
const axios = require("axios");

const DEF_ITEM_DETAILS = {
    duration: "",
    price: "",
}

const RequestTour = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState();
  const [tourDetails, setTourDetails] = useState(DEF_ITEM_DETAILS);
  const [cookies, setCookies, removeCookies] = useCookies(["Customerid", "userType"]);
  const [showTours, setShowTours] = useState([]); 
  const [tour, setTour] = useState({});
  const [tourid, setTourId] = useState();
  const [flag, setFlag] = useState(false);
  let a = {};
  let i;

  const inputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    switch (name) {

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

  useEffect(() => {
    const userType = cookies.userType;
    if (userType !== null) {
      setUserType(userType);
    }
    loadTours();
  }, []);

  const loadTours = (e) => {
    axios
    .get("https://us-central1-assignment4-355202.cloudfunctions.net/get-tour")
      .then((res) => {
        console.log(res.data);
        console.log("hi");
        setShowTours(res.data);
        console.log("hi");
        console.log(showTours);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleRequestTourSubmit = (e) => {
    e.preventDefault();
    console.log(tourDetails);

    axios
      .post("https://us-central1-assignmen-356103.cloudfunctions.net/test", {
        stay_duration: tourDetails.duration,
        max_budget: tourDetails.price
      })
      .then((res) => {
        console.log(res.data);
        setTourId(res.data);

        for(i =0; i<showTours.length; i++) {
            a = showTours[i];
            if(tourid === a.tourid) {
                setTour(a);
            }
        }
        setFlag(true);
        alert("Tour request submitted successfully.");
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.res);
        alert("No tour package available for specified duration and budget");
        navigate("/");
      }); 
  };

  const handleTourClick = (id) => {
    
    if(userType) {
      navigate("/booktour/" + id);
    }
    else {
      Swal.fire({
        icon: "warning",
        title: "Sign in is required!",
        text: "Press OK to login",
      }).then(() => {
        navigate("/login");
      })
    }
    
  };

  return (
    <div>
       <HomeHeader />
    
    <div className="container mt-2">
     {flag ? (<div>
        <center className="mt-2">
        <h3> Tour Package</h3>
      </center>
      <Row className="justify-content-md-center">
      <Card className="totalCard">
      <div className="row propertyCard">
                      <Col xs lg="2">
                        <Card className="housedetails">
                        <span className="househeading">
                            Tour number: {tour.tourid}
                          </span>
                          <br></br>
                          <span className="househeading">
                            Tour name: {tour.tourname}
                          </span>
                          <br></br>
                          <span className="househeading">
                            Description: {tour.description}
                          </span>
                          <br />
                          <span className="househeading">
                            Stay duration: {tour.duration}
                          </span>
                          <br />
                          <span>Budget: CA$ {tour.price}</span>
                        </Card>
                        </Col>
                        <Col xs lg="2">
                        <Button
                          variant="success saveproperty"
                          onClick={() => handleTourClick(tour.tourid)} >
                          Book room
                        </Button>
                        </Col>
        </div>
      </Card>
      </Row>
     </div>) : (<div><center className="mt-2">
        <h3> Request a tour</h3>
      </center>
      <Form className="mt-4 border border-primary">
        <div className="form-group m-3 p-3">
          <label>Duration</label>
          <input
            className="form-control"
            type="text"
            name="duration"
            placeholder="Enter stay duration"
            onChange={inputChange}
          />
        </div>
        <div className="form-group m-3 p-3">
          <label>Price</label>
          <input
            className="form-control"
            type="text"
            name="price"
            placeholder="Enter maximum budget"
            onChange={inputChange}
          />
        </div>
        <center>
          <Button className = "mb-2" variant="success" onClick={handleRequestTourSubmit}>
             Submit
          </Button>
        </center>
      </Form></div>) }
      
    </div>
    </div>
  );
};

export default RequestTour;
