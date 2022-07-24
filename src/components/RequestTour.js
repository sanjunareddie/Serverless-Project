import { useState, useEffect, React } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import HomeHeader from "./HomeHeader";
import Swal from "sweetalert2";
import LexChat from "react-lex-plus";
import { useCookies } from "react-cookie";
import bgimage from "../images/bg1.jpg";
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
  const [sampleTours, setSampleTours] = useState([]);
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
  }, [1]);

  const loadTours = (e) => {
    axios
    .get("https://us-central1-assignment4-355202.cloudfunctions.net/get-tour")
      .then((res) => {
        setShowTours(res.data);
        setSampleTours(res.data);
        console.log(showTours);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleRequestTourSubmit = (e) => {
    console.log(showTours);
    e.preventDefault();
    console.log(tourDetails);
    console.log(sampleTours);
    if(userType) {
      axios
      .post("https://us-central1-assignmen-356103.cloudfunctions.net/test", {
        stay_duration: tourDetails.duration,
        max_budget: tourDetails.price
      })
      .then((res) => {
        console.log(res.data);
        setTour(res.data);
        console.log(tour);
        setFlag(true);
        alert("Tour request submitted successfully.");
      })
      .catch((error) => {
        console.log(error.res);
        alert("No tour package available for specified duration and budget");
        navigate("/");
      }); 
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
    <>
        <div className='container-fluid homeimage' style={{ backgroundImage: `url(${bgimage})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", paddingBottom: "20%" }}>

       <HomeHeader />
    
    <div lassName="container mt-20"><center className="mt-20">
        <h3> Request a tour</h3>
      </center>
      <Form className="bg-white p-4 mb-5 border" style={{width: "500px", marginLeft: "400px", marginTop:"20px"}}>
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
      </Form></div>
      {flag ? (
        <div style={{marginLeft: "450px", marginTop:"20px"}}>
          
          <div className="row propertyCard">
                      <Col xs lg="2"></Col>
                      <Col xs lg="8">
                        <Card >
                        <h3>Suggested tour package</h3>
                        <span >
                            <b>Tour Name:</b> {tour.tourname}
                          </span>
                          <span >
                           <b> Description: </b>{tour.description}
                          </span>
                          <span >
                            <b>Duration: </b> {tour.duration}
                          </span>
                          <br />
                          <span><b>Budget: </b>CA$ {tour.price}</span>
                        </Card>
                        </Col>
                        
                        <Button
                        style={{marginTop: "30px"}}
                          variant="success saveproperty"
                          onClick={() => handleTourClick(tour.tourid)} >
                          Book tour
                        </Button>
                        
                    </div>
        </div>
      ) : (null)}
      </div>
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

export default RequestTour;
