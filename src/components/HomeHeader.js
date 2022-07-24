import React, { useEffect, useState } from "react";
import { AxiosContext } from "react-axios/lib/components/AxiosProvider";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Container, Navbar, Row, Nav, NavDropdown,Dropdown, DropdownButton } from "react-bootstrap";
import { useCookies } from "react-cookie";
import bgimage from "../images/cupcakes.jpg";
import { useNavigate } from "react-router-dom";
import "../../src/index.css";

export const HomeHeader = () => {
  const [userType, setUserType] = useState();
  const [userEmail, setUserEmail] = useState();
  const [logInTime, setLogInTime] = useState();
  const [userNotifications, setNotification] = useState([]);
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

  const getNotifications = () => {
    let user_details = {
      email: userEmail,
  };
    axios
    .post("https://us-central1-assignment4-355202.cloudfunctions.net/fetch_notification", user_details)
    .then((res) => {
      let notificationList = res.data.notification;
      let notification = [];
      for (let i = 0; i < notificationList.length; i++) {
       let singleList = notificationList[i];
       for (let i = 0; i < singleList.length; i++) {
        let obj = {};
        let entries = Object.entries(singleList[i])
        let data = entries.map( ([key, val], entry) => {
          obj.dateTime = key;
          obj.notification = val;
          notification.push(obj);
        });
       }
      }
      setNotification(notification)
      console.log("proper notification list ", userNotifications)
    }).catch((error) => {
        console.log(error.response);
        alert("error");
      }); 
  }


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
                    backgroundColor: "orange",
                    marginRight: "20px"
                  }}
                >
                  Home
                </Button>

                {(userType == "customer") && (
                 
                 <DropdownButton id="notification-button" title="Notifications" onClick={getNotifications} 
                 style={{
                  display: "inline"
                }}>
                 {userNotifications?.length ? userNotifications.map((list, index) => {
                  return (<div>
                  <Dropdown.Item  style={{inlineSize: "222px", fontSize: "12px", whiteSpace: "pre-line", height: "100px"}} key={index}>
                    <div style={{display: "flex", alignItems: "center"}}>
                      <img src={bgimage} style={{width: "20px", height: "20px", display: "inline", marginRight: "8px"}}></img>
                      <div>
                        <div>{list?.notification}</div> 
                        <div style={{float: "right", fontSize: "9px", color: "gray"}}><i>{list?.dateTime}</i></div>
                      </div>
                    </div>
                    
                  </Dropdown.Item>
                   { (index != userNotifications?.length - 1) && (<hr />)}
                  </div>)
                 }): <Dropdown.Item >No notifications</Dropdown.Item> }
               </DropdownButton>
                         )}


                {!userType && (
                  <>
                    <Button
                      href="/login"
                      style={{
                        color: "white",
                        textDecoration: "none",
                        backgroundColor: "orange",
                        marginRight: "20px"
                      }}
                    >
                      Login
                    </Button>

                    <Button
                      href="/signup"
                      style={{
                        color: "white",
                        textDecoration: "none",
                        backgroundColor: "orange",
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
                      backgroundColor: "orange",
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
