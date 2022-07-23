import { useState, React, useEffect } from "react";
import HomeHeader from "./HomeHeader";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import { Card, Container, Button, Form, FormControl, Nav, Navbar, NavDropdown, Row,Col, NavbarBrand } from 'react-bootstrap'
import bgimage from "../images/bg1.jpg";
import "../../src/index.css";

const HomePage = (props) => { 

    const [userType, setUserType] = useState();
    const [cookies, setCookies, removeCookies] = useCookies(["logInTime", "userType", "Email", "Customerid", "Token"]);
    const navigate = useNavigate();

    useEffect(() => {
        const userType = cookies.userType;
        if (userType !== null) {
          setUserType(userType);
        }
      }, []);

    const handleFeedback = () => {
        if(userType) {
            navigate("/providefeedback");
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
    }

    return(
        <div className='container-fluid homeimage' style={{ backgroundImage: `url(${bgimage})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
            
            <Row><HomeHeader /></Row>
            <div className="homediv">
                <Row style={{marginTop: "15%"}}> 
                    
                    <Col className="homeCard">
                    <Card>
                        <div>
                            <h2>Available rooms</h2>
                            <p>We provide customers with a variety of rooms, each having a great view of the city side.</p>
                            <Button onClick={() => navigate("/availablerooms")}>See available rooms</Button>
                        </div>
                    </Card>
                    </Col>
                    <Col className="homeCard">
                    <Card>
                        <div >
                            <h2>Restaurant Menu</h2>
                            <p>We have a kitchen which serves the customers with delicious food and a wide range of varities.</p>
                            <Button onClick={() => navigate("/orderfood")}>View Menu</Button>
                        </div>
                    </Card>
                    </Col>
                    <Col className="homeCard">
                    <Card >
                        <div >
                            <h2>Tour packages</h2>
                            <p>Located in a beautiful city, we provide customers with lot of tour options to enjoy the city's scenery, history & culture </p>
                            <Button onClick={() => navigate("/tours")}>Book tours</Button>
                        </div>
                    </Card>
                    </Col>
                    <Col className="homeCard">
                    <Card >
                        <div >
                            <h2>Provide Feedback</h2>
                            <p>Kindly help us improve our services by providing your valuable feedback. Thanks in advance</p>
                            <Button onClick={handleFeedback}>Provide feedback</Button>
                        </div>
                    </Card>
                    </Col>
                </Row>
                </div>
        
        </div>
    )
}

export default HomePage;