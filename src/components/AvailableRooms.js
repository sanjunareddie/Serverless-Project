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

function AvailableRooms() {

  const [userType, setUserType] = useState();
  const [cookies, setCookies, removeCookies] = useCookies(["Customerid", "userType"]);
  
  const [showRooms, setShowRooms] = useState([]);  
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userType = cookies.userType;
    if (userType !== null) {
      setUserType(userType);
    }
    loadRooms();
  }, []);

  const loadRooms = (e) => {
    axios
    .get("https://us-central1-assignment4-355202.cloudfunctions.net/get-room")
      .then((res) => {
        console.log(res.data);
        console.log("hi");
        setShowRooms(res.data);
        console.log("hi");
        console.log(showRooms);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const handleRoomClick = (id) => {
    
    if(userType) {
      navigate("/bookroom/" + id);
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
            {showRooms? (
              <div>
                <h2 className="heading" variant="primary">
                  List of available rooms
                </h2>
                <div>
                  {showRooms.map((item) => (
                    <div className="row propertyCard">
                      <Col xs lg="2">
                        <Card className="housedetails">
                        <span className="househeading">
                            Room Number: {item.roomnumber}
                          </span>
                          <span className="househeading">
                            Room category: {item.roomType}
                          </span>
                          <span className="househeading">
                            Bedrooms: {item.bedrooms}
                          </span>
                          <br />
                          <span>CA$ {item.price}/night</span>
                        </Card>
                        </Col>
                        <Col xs lg="2">
                        <Button
                          variant="success saveproperty"
                          onClick={() => handleRoomClick(item.roomnumber)} >
                          Book room
                        </Button>
                        </Col>
                    </div>
                  ))}{" "}
                </div>
              </div>
            ) : (
              <Card className="nohouses">
                <span>
                  No rooms available
                </span>
              </Card>
            )}
          </Card>
          </Row>
          
          </div>
      </div>
    
  );
}

export default AvailableRooms;
