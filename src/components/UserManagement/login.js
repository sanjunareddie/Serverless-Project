import { useState, React } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useCookies } from "react-cookie";
import "./UserAuth.css";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const navigate = useNavigate();
  var token = "";
  var userEmail = "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookie, setCookie] = useCookies(["Token", "Email"]);
  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios
        .post("", {
          email: email,
          password: password,
        })
        .then((res) => {
          token = res.data.data.token;
          userEmail = res.data.data.email;
          setCookie("Token", token, { path: "/" });
          setCookie("Email", userEmail, { path: "/" });
          navigate("/login2");
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
      <h3>Account Login</h3>
      <hr style={{ width: "50%", border: "1px solid black" }} />
      <Form
        onSubmit={handleSubmit}
        style={{ width: "330px", textAlign: "left", marginTop: "2" }}
      >
        <Form.Group>
          <Form.Label>Registered user ID</Form.Label>
          <Form.Control
            type="text"
            name="email"
            value={email}
            placeholder="Please enter your email address"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={password}
            placeholder="Please enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="button-container" type="submit" onClick={handleSubmit}>
          Submit
        </div>
        <hr style={{ width: "0%" }} />
        {/* <p>
          {" "}
          Forgot your password? <Link to="/forgot">Click here</Link>{" "}
        </p> */}
        Not Registered? &nbsp;
        <Link to="/signup">Sign Up</Link>
      </Form>
      <hr style={{ width: "0%" }} />
    </div>
  );
};
export default Login;
