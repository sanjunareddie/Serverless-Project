import {React, useState, useEffect} from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import bgimage from "../images/bg1.jpg";
import LexChat from "react-lex-plus";
import HomeHeader from "./HomeHeader";
import "../../src/index.css";

const OrderFood = (props) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState([]); 
    const [userEmail, setUserEmail] = useState();
    const [userType, setUserType] = useState();
    const [order, setOrder] = useState([]); 
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
        loadMenu();
      }, []);

      const handleChange = (event, item) => {
       let quantityy = Number(event.target.value);
        let name= item.itemname;
        let id= item.itemid;
        let pricee=item.price;
        let orderList = order;
        orderList[id] = {
            itemid: id,
            itemname: name,
            price: pricee,
            quantity: quantityy,
        }   
    }

    const loadMenu = (e) => {
        axios
        .get("https://us-central1-assignment4-355202.cloudfunctions.net/get-menu")
          .then((res) => {
            console.log(res.data);
            setShowMenu(res.data);
            console.log(showMenu);
          })
          .catch((error) => {
            console.log(error.response);
            Swal.fire({
                icon: "warning",
                title: "Error loading menu, try after sometime",
                text: "Press OK",
              }).then(() => {
                navigate("/");
              })
          });
      };
    
    const handleSubmit = (e) => {
        if(userEmail!== null) {
            e.preventDefault();
        const orders = order;
        let order_details = {
            userEmail: userEmail,
        };
        for (let i in orders) {
            order_details = {...order_details, [i]:orders[i]};
            }
            console.log(order_details);
        axios.post("https://us-central1-serverless-a2-352802.cloudfunctions.net/order_food", order_details).then((response) => {
            console.log(response);
            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Order placed",
                    text: "Press OK",
                  }).then(() => {
                    navigate("/");
                  })
                }
        }).catch((err) => {
            console.log(err);
            Swal.fire({
                icon: "warning",
                title: "Kindly book a room to order food",
                text: "Press OK",
              }).then(() => {
                navigate("/availablerooms");
              })
        })    
        } else {
            Swal.fire({
                icon: "warning",
                title: "Kindly login to use our services",
                text: "Press OK",
              }).then(() => {
                navigate("/");
              })
        } 
    }

    return (
        <>
            <div className='container-fluid homeimage' style={{ backgroundImage: `url(${bgimage})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", paddingBottom: "10%" }}>
            <Row><HomeHeader /></Row>
            <section className="" id="next">
            <div className="container">
                <div className="row" style={{marginTop: "3%"}}>
                    <div className="col-4"></div>
                    <div className="col-4 bg-white mb-2 border">
                        <form>
                    {showMenu? (
                    <div>
                        <h3>Menu</h3>
                        <div>
                        {showMenu.map((item) => (
                            
                            <div className="row">
                            <div className="form-group">
                                <h6>{item.itemname}</h6>
                                <label className="text-black font-weight-bold" > Price {item.price}</label>
                                <br></br>
                                <input type="number" defaultValue={0}name={item.itemid} id={item.itemid}
                                    onChange={(e) => handleChange(e, item)} min={0}
                                     style={{ width: '80px' }} />
                                <hr></hr>
                            </div>
                            <br></br>
                            
                        </div>
                        
                        ))}{" "}
                        <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e)}>Order</button>
                        </div>
                    </div>
                    ) : (<h1>Oops!</h1>)}
                    </form>

                    {/* <div className="col-md-4 form-group"></div>
                        <div className="col-md-4 form-group">
                            <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e)}>Order</button>
                        </div> */}
                    
                    </div>
                </div>
            </div>
        </section>
            
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
}

export default OrderFood;