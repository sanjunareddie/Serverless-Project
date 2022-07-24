/* 
  authorName : Sanjuna Konda 
  email : sn493898@dal.ca
*/

import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import HomeHeader from "./HomeHeader";
import Swal from "sweetalert2";
import axios from "axios";
import bgimage from "../images/bg1.jpg";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../src/index.css";

function AvailableTours() {

  const [userType, setUserType] = useState();
  const [cookies, setCookies, removeCookies] = useCookies(["Customerid", "userType"]);
  
  const [showTours, setShowTours] = useState([]);  
  const navigate = useNavigate();

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

  //const token = localStorage.getItem("token");

 // if (token == null) {
   // navigate("/sign-in");
 // }

  return (
    <div className='container-fluid homeimage' style={{ backgroundImage: `url(${bgimage})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
        <Row><HomeHeader /></Row>
        <div className="homediv">
          
        <Row className="justify-content-md-center">
          <Card className="totalCard">
            {showTours? (
              <div>
                <h2 className="heading" variant="primary">
                  List of available tours
                </h2>
                <div>
                  {showTours.map((item) => (
                    <div className="row propertyCard">
                      <Col xs lg="2">
                        <Card className="housedetails">
                          <span className="househeading">
                            Tour name: {item.tourname}
                          </span>
                          <span className="househeading">
                            Duration: {item.duration}
                          </span>
                          <br />
                          <span>CA$ {item.price}/night</span>
                        </Card>
                        </Col>
                        <Col xs lg="2">
                        <Button
                          variant="success saveproperty"
                          onClick={() => handleTourClick(item.tourid)} >
                          Book tour
                        </Button>
                        </Col>
                    </div>
                  ))}{" "}
                </div>
              </div>
            ) : (
              <Card className="nohouses">
                <span>
                  No tour packages available at this time
                </span>
              </Card>
            )}
          </Card>
          </Row>
          
          </div>
      </div>
    
  );
}

export default AvailableTours;
