import { useState, React, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import HomeHeader from "./HomeHeader";
import DatePicker from "react-datepicker";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
const axios = require("axios");

const ProvideFeedback = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState();
  const [feedback, setFeedback] = useState("");
  const [cookies, setCookies] = useCookies(["Customerid"]);

  useEffect(() => {
    const userId = cookies.Customerid;
    if (userId!== null) {
        setUserId(userId);
    }
  }, [1]);


  const inputChange = (e) => {
    const value = e.target.value;
    setFeedback(value);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://us-central1-assignment4-355202.cloudfunctions.net/add-feedback", {
        customerid: userId,
        feedback: feedback
      })
      .then((res) => {
        alert("Feedback submitted successfully.");
        navigate("/");
        window.location.reload();
      });
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
