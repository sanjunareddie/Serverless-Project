import { useState, React } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useCookies } from "react-cookie";
import "./UserAuth.css";
import { useNavigate } from "react-router-dom";

const Login2 = (props) => {
  let customerid="";
  let userType=""
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [cookies, setCookies] = useCookies(["Email", "Customerid", "userType"]);
  
  const userEmail = cookies.Email;
  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios
        .post("https://us-central1-assignment4-355202.cloudfunctions.net/login-user-2", {
          email:userEmail,
          question: question,
          answer: answer,
        })
        .then((res) => {
          customerid = res.data.customerid;
          userType = res.data.userType;
          setCookies("Customerid", customerid, { path: "/" });
          setCookies("userType", userType, { path: "/" });
          alert("User data has matched successfully.");
          navigate("/login3");
        })
        .catch((error) => {
          alert("Server error. Please try again!");
        });
    } catch (err) {
      alert("Could not send the Request. Please try again!");
      navigate("/login");
    }
  };
  return (
    <div className="login-container flex-column">
      <hr />
      <h3>Account Login - 2MFA</h3>
      <hr style={{ width: "50%", border: "1px solid black" }} />
      <Form
        onSubmit={handleSubmit}
        style={{ width: "330px", textAlign: "left", marginTop: "2" }}
      >
        <Form.Group>
              <Form.Label> Please select your security question</Form.Label>
              <select
                id="question"
                // value={question.value}
                onChange={(event) => setQuestion(event.target.value)}
              >
                <option>Please choose an option</option>
                <option value="What is your favourite colour?">
                  What is your favourite colour?
                </option>
                <option value="What is favorite sport?">
                  What is favorite sport?
                </option>
              </select>
            </Form.Group>
        <Form.Group>
          <Form.Label>Your answer</Form.Label>
          <Form.Control
            type="text"
            name="answer"
            value={answer}
            placeholder="Please enter your answer"
            onChange={(e) => setAnswer(e.target.value)}
          />
        </Form.Group>
        <div className="button-container" type="submit" onClick={handleSubmit}>
          Submit
        </div>
        <hr style={{ width: "0%" }} />
        Not Registered? &nbsp;
        <Link to="/signup">Sign Up</Link>
      </Form>
      <hr style={{ width: "0%" }} />
    </div>
  );
};
export default Login2;
