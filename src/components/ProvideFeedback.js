import { useState, React, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import HomeHeader from "./HomeHeader";
import LexChat from "react-lex-plus";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import bgimage from "../images/bg1.jpg";
import { useNavigate } from "react-router";
const axios = require("axios");

const ProvideFeedback = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState();
    const [userType, setUserType] = useState();
  const [feedback, setFeedback] = useState("");
  const [cookies, setCookies] = useCookies(["Email", "userType"]);

  useEffect(() => {
    const userEmail = cookies.Email;
    const userType = cookies.userType;
        if (userType !== null) {
          setUserType(userType);
        }
    if (userEmail!== null) {
      setUserEmail(userEmail);
    }
  }, [1]);


  const inputChange = (e) => {
    const value = e.target.value;
    setFeedback(value);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://us-central1-serverless-a2-352802.cloudfunctions.net/sentiment_analysis", {
        email: userEmail,
        feedback: feedback
      })
      .then((res) => {
        console.log(res);
        alert("Feedback submitted successfully.");
        navigate("/");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "warning",
          title: "Error submitting feedback, try again",
          text: "Press OK",
        }).then(() => {
          navigate("/providefeedback");
        })
      }) 
  };

  return (
    <>
      <div className='container-fluid homeimage' style={{ backgroundImage: `url(${bgimage})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", paddingBottom: "40%" }}>
       <HomeHeader />
    
    <div className="container mt-20">
     
      <center className="mt-20">
        <h3> Provide feedback</h3>
      </center>
      <Form className="bg-white p-4 mb-5 border" style={{width: "500px", marginLeft: "300px", marginTop:"20px"}}>
      <div className="form-group m-3 p-3">
          <input
            className="form-control"
            type="text"
            name="roomnumber"
            placeholder="provide feedback"
            onChange={inputChange}
          />
        </div>
        <center>
          <Button className = "mb-2" variant="success" onClick={handleFeedbackSubmit}>
            Submit
          </Button>
        </center>
      </Form>
    </div>
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

export default ProvideFeedback;
