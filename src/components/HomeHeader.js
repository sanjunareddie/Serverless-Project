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
    
        removeCookies("logInTime");
    	removeCookies("userType");
    	removeCookies("Email");
    	removeCookies("Customerid");
   	removeCookies("Token");
    	removeCookies("RoomNumber");
        alert("logged out successfully.");
        navigate("/login");
    
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
