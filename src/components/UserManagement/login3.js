import { useState, useRef, React } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useCookies } from "react-cookie";
import "./UserAuth.css";
import { useNavigate } from "react-router-dom";
var randomstring = require("randomstring");

const Login3 = (props) => {
  const navigate = useNavigate();
  var token = "";
  var userEmail = "";
  const [decodeText, setDecodeText] = useState("");
  const [cookie, setCookie] = useCookies(["Token", "Email"]);
  let encyKey = useRef(Math.floor(Math.random() * (5 - 0) + 0));
  // let encodeText = useRef(randomstring.generate({length: 12, charset: 'alphabetic', capitalization:'lowercase'}));

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios
        .post("", {
          // encodeText: encodeText,
          encyKey: encyKey,
          decodeText: decodeText,
        })
        .then((res) => {
          token = res.data.data.token;
          userEmail = res.data.data.email;
          setCookie("Token", token, { path: "/" });
          setCookie("Email", userEmail, { path: "/" });
          navigate("/");
        })
        .catch((error) => {
          alert("Invalid Credentials. Please try again!");
        });
    } catch (err) {
      alert("Could not send the Request. Please try again!");
      navigate("/login");
    }
  };
  return (
    <div className="login-container flex-column">
      <hr />
      <h3>Account Login - 3MFA</h3>
      <hr style={{ width: "50%", border: "1px solid black" }} />
      <Form
        onSubmit={handleSubmit}
        style={{ width: "330px", textAlign: "left", marginTop: "2" }}
      >
        <Form.Group>
          {/* <Form.Label>{encodeText}</Form.Label>
        <Form.Label>{encyKey}</Form.Label> */}
          <Form.Label>Please enter the decoded text</Form.Label>
          <Form.Control
            type="text"
            name="email"
            value={decodeText}
            placeholder="Please enter your email address"
            onChange={(e) => setDecodeText(e.target.value)}
          />
        </Form.Group>
        <div className="button-container" type="submit" onClick={handleSubmit}>
          Login
        </div>
        <hr style={{ width: "0%" }} />
        <p>
          {" "}
          Forgot your password? <Link to="/forgot">Click here</Link>{" "}
        </p>
        Not Registered? &nbsp;
        <Link to="/signup">Sign Up</Link>
      </Form>
      <hr style={{ width: "0%" }} />
    </div>
  );
};
export default Login3;
