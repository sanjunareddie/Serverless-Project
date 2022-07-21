import React, { useEffect, useState } from "react";
import { AxiosContext } from "react-axios/lib/components/AxiosProvider";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Container, Navbar, Row } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "../../src/index.css";

export const HomeHeader = () => {
  const [userType, setUserType] = useState();
  const [userEmail, setUserEmail] = useState();
  const [logInTime, setLogInTime] = useState();
  const [cookies, setCookies, removeCookies] = useCookies(["logInTime", "userType", "Email", "Customerid", "Token", "RoomNumber"]);
  
  const navigate = useNavigate();
  useEffect(() => {
    const userEmail = cookies.Email;
    const userType = cookies.userType;
    const logInTime = cookies.logInTime;
    if (userEmail !== null) {
      setUserEmail(userEmail);
    }
    if (userType !== null) {
      setUserType(userType);
    }
    if (logInTime !== null) {
      setLogInTime(logInTime);
    }
  }, [1]);

  const handleLogout = () => {
    axios
      .post("https://us-central1-assignment4-355202.cloudfunctions.net/login_stats", {
        email: userEmail,
        login: logInTime
      })
      .then((res) => {
        removeCookies("logInTime");
    	removeCookies("userType");
    	removeCookies("Email");
    	removeCookies("Customerid");
   	removeCookies("Token");
    	removeCookies("RoomNumber");
        window.location.reload();
        alert("logged out successfully.");
        navigate("/login");
        
      })
      .catch((error) => {
        console.log(error.response);
        alert("error");
      }); 
    
};
  //console.log(userType);
  return (
    <>
      <Navbar>

        <Container>
          <Row style={{ width: "35%" }}>
            <div className="navheader">
              <Navbar.Brand>
                <Button
                  href="/"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    backgroundColor: "transparent"
                  }}
                >
                  Home
                </Button>

                {userType == "hotel_management_admin" && (
                  <Button
                    href="/viewfeedback"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      backgroundColor: "transparent"
                    }}
                  >
                    Feedback Analysis
                  </Button>
                )}
                {(userType == "customer") && (
                  <Button
                    href="/feedback"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      backgroundColor: "transparent"
                    }}
                  >
                    Provide Feedback
                  </Button>
                )}

                {(userType == "customer") && (
                  <Button
                    href="/bookrooms"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      backgroundColor: "transparent"
                    }}
                  >
                    Book rooms
                  </Button>
                )}

                {(userType == "customer") && (
                  <Button
                    href="/orderfood"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      backgroundColor: "transparent"
                    }}
                  >
                    Order food
                  </Button>
                )}

                {(userType == "customer") && (
                  <Button
                    href="/viewmenu"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      backgroundColor: "transparent"
                    }}
                  >
                    View menu
                  </Button>
                )}

                {(userType == "customer") && (
                  <Button
                    href="/booktours"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      backgroundColor: "transparent"
                    }}
                  >
                    Book tours
                  </Button>
                )}

                {userType == "hotel_management_admin" && (
                  <Button
                    href="/addrooms"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      backgroundColor: "transparent"
                    }}
                  >
                    Add Rooms
                  </Button>
                )}

                {userType == "hotel_management_admin" && (
                  <Button
                    href="/viewfoodorders"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      backgroundColor: "transparent"
                    }}
                  >
                    View Food orders
                  </Button>
                )}

                {userType == "tour_operator" && (
                  <Button
                    href="/addtour"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      backgroundColor: "transparent"
                    }}
                  >
                    Add tour
                  </Button>
                )}

                {userType == "tour_operator" && (
                  <Button
                    href="/viewrequestedtours"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      backgroundColor: "transparent"
                    }}
                  >
                    View requested tours
                  </Button>
                )}

                {!userType && (
                  <>
                    <Button
                      href="/login"
                      style={{
                        color: "white",
                        textDecoration: "none",
                        backgroundColor: "transparent"
                      }}
                    >
                      Login
                    </Button>

                    <Button
                      href="/signup"
                      style={{
                        color: "white",
                        textDecoration: "none",
                        backgroundColor: "transparent"
                      }}
                    >
                      Register
                    </Button>
                  </>
                )}

                {userType && (
                  <Button
                    style={{
                      color: "white",
                      textDecoration: "none",
                      backgroundColor: "transparent"
                    }}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                )}
              </Navbar.Brand>
            </div>
          </Row>
        </Container>
      </Navbar>
    </>
  );
};

export default HomeHeader;
