import {React, useState, useEffect} from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import bgimage from "../images/bg1.jpg";
import HomeHeader from "./HomeHeader";
import "../../src/index.css";

const OrderFood = (props) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState([]); 
    const [userEmail, setUserEmail] = useState();
    
    const [order, setOrder] = useState([]); 
    const [cookies, setCookies] = useCookies(["Email"]);
    useEffect(() => {
        const userEmail = cookies.Email;
        
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
        axios.post("https://us-central1-assignment4-355202.cloudfunctions.net/order-food", order_details).then((response) => {
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
        <div>
            <div className='container-fluid homeimage' style={{ backgroundImage: `url(${bgimage})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
            <Row><HomeHeader /></Row>
            <section className="section contact-section" id="next">
            <div className="container">
                <div className="row">
                    <div className="col-md-7">
                        <form className="bg-white p-md-5 p-4 mb-5 border">
                    {showMenu? (
                    <div>
                        <h1>Menu</h1>
                        <div>
                        {showMenu.map((item) => (
                            <div className="row">
                            <div className="col-md-12 form-group">
                                <h3>{item.itemname}</h3>
                                <label className="text-black font-weight-bold" > Price {item.price}</label>
                                <input type="number" defaultValue={0}name={item.itemid} id={item.itemid}
                                    onChange={(e) => handleChange(e, item)} min={0}
                                    className="form-control" style={{ width: '80px' }} />
                                <hr></hr>
                            </div>
                        </div>
                        ))}{" "}
                        </div>
                    </div>
                    ) : (<h1>Oops!</h1>)}
                    </form>
                        <div className="col-md-6 form-group">
                            <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e)}>Order</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
            
        </div>
        </div>
    );
}

export default OrderFood;