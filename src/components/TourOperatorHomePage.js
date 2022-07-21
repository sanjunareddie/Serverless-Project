import { useState, React } from "react";
import HomeHeader from "./HomeHeader";
import { useNavigate } from "react-router";
import { Card, Container, Button, Form, FormControl, Nav, Navbar, NavDropdown, Row,Col, NavbarBrand } from 'react-bootstrap'
import bgimage from "../images/bg1.jpg";
import "../../src/index.css";

const TourOperatorHomePage = (props) => { 

    const navigate = useNavigate();

    return(
        <div className='container-fluid homeimage' style={{ backgroundImage: `url(${bgimage})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
            
            <Row><HomeHeader /></Row>
            <div className="homediv">
                <Row style={{marginTop: "15%"}}> 
                    
                    <Col className="homeCard">
                    <Card>
                        <div>
                            <h2>Add tours</h2>
                            <p>Add tour packages for the customers to view and book accordingly</p>
                            <Button onClick={() => navigate("/addtour")}>Add tour</Button>
                        </div>
                    </Card>
                    </Col>
                    <Col className="homeCard">
                    <Card>
                        <div >
                            <h2>Tour requests</h2>
                            <p>View the tour requested by the customer in order to add appropriate tour packages if possible.</p>
                            <Button onClick={() => navigate("/tourrequests")}>View tour requests</Button>
                        </div>
                    </Card>
                    </Col>
                </Row>
                </div>
        
        </div>
    )
}

export default TourOperatorHomePage;