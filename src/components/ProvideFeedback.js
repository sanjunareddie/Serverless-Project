import { useState, React, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import HomeHeader from "./HomeHeader";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
const axios = require("axios");

const ProvideFeedback = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState();
  const [feedback, setFeedback] = useState("");
  const [cookies, setCookies] = useCookies(["Email"]);

  useEffect(() => {
    const userEmail = cookies.Email;
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
    <div>
       <HomeHeader />
    
    <div className="container mt-2">
     
      <center className="mt-2">
        <h3> Provide feedback</h3>
      </center>
      <Form className="mt-4 border border-primary">
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
  );
};

export default ProvideFeedback;
