import { useState, useRef, React } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useCookies } from "react-cookie";
import "./UserAuth.css";
import { useNavigate } from "react-router-dom";

const encyKey = Math.floor(Math.random() * (4 - 0) + 1);

function makeid(length) {
  var result           = '';
  var characters       = 'abcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}
const cipher = makeid(10);

const Login3 = (props) => {
  const navigate = useNavigate();
  const [decodeText, setDecodeText] = useState("");

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios
        .post("https://us-central1-assignment4-355202.cloudfunctions.net/login-user-3", {
          text: cipher,
          key: encyKey,
          decrypt: decodeText,
        })
        .then((res) => {
          if(res.data.data == "Cipher matched"){
          alert(res.data.data);
          navigate("/");}
          else if (res.data.data == "Cipher mismatched"){
            alert(res.data.data);
            navigate("/login3")

          }
        })
        .catch((error) => {
          alert("Cipher code mismatch. Please try again!");
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
          <Form.Label>Encoded text</Form.Label>
          <Form.Control
            type="text"
            name="email"
            value={cipher}
            disabled
          />
        </Form.Group>
        <Form.Group>
          {/* <Form.Label>{encodeText}</Form.Label>
        <Form.Label>{encyKey}</Form.Label> */}
          <Form.Label>Key</Form.Label>
          <Form.Control
            type="text"
            name="email"
            value={encyKey}
            disabled
          />
        </Form.Group>
        <Form.Group>
          {/* <Form.Label>{encodeText}</Form.Label>
        <Form.Label>{encyKey}</Form.Label> */}
          <Form.Label>Please enter the decoded text</Form.Label>
          <Form.Control
            type="text"
            name="email"
            value={decodeText}
            placeholder="Please enter the decoded text here."
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
