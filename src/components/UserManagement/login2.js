import { useState, React } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useCookies } from "react-cookie";
import "./UserAuth.css";
import { useNavigate } from "react-router-dom";

const Login2 = (props) => {
  const navigate = useNavigate();
  var token = "";
  var userEmail = "";
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [cookie, setCookie] = useCookies(["Token", "Email"]);

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios
        .post("", {
          question: question,
          password: answer,
        })
        .then((res) => {
          token = res.data.data.token;
          userEmail = res.data.data.email;
          setCookie("Token", token, { path: "/" });
          setCookie("Email", userEmail, { path: "/" });
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
          <select value={question.value} onChange={(event) => setQuestion({value: event.target.value})}>
          <option value="Favourite colour">Your favourite colour</option>
          <option value="Favorite sport">Your favorite sport</option>
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
