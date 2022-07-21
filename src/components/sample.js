import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cover from "../home/Cover";
import Header from "../home/Header";
import { ReactSession } from 'react-client-session';

export default function OrderFood(props) {


    return (<>
        <Header />
        <Cover stitle='Order Food From Our Amazing Kitchen.' btitle="Welcome to Serverless Kitchen" />
        <OrderFoodForm />
    </>);

}

function OrderFoodForm(props) {
    ReactSession.setStoreType('localStorage');

    const [menu, setMenu] = useState([]);

    const [menumap, setMenuMap] = useState({});
    const [order, setOrder] = useState({});

    useEffect(() => {
        axios.get('https://jxwvbh2m2visbklkd3nji57nqm0finyy.lambda-url.us-east-1.on.aws/').then((response) => {
            // console.log(response.data);
            if (response.status === 200) {
                if (response.data.statusCode === 200) {
                    const menu = response.data.menu
                    let dish, price, dishId;
                    let finalMenu = []
                    let menuMap = {}
                    for (let m in menu) {
                        dish = menu[m]['dish_name']['S']
                        price = menu[m]['price']['N']
                        dishId = menu[m]['dish_id']['N']
                        finalMenu.push({
                            dish_name: dish,
                            dish_id: dishId,
                            price: price,
                        });
                        menuMap[dishId] = {
                            dish_name: dish,
                            dish_id: dishId,
                            price: price
                        }
                    }
                    setMenu(finalMenu);
                    setMenuMap(menuMap)
                }
            } else {
                alert('Something went wrong!');
            }
        })
    }, []);

    useEffect(() => {
        if (menu || menu.length > 0) {
            return;
        }
    }, [menu])


    const handleChange = (event) => {
        const { name, value } = event.target;
        let lorder = order;
        lorder[name] = value;
    }

    let navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const orders = order;
        let order_details = []
        for (let i in orders) {
            if (orders[i] > 0) {
                order_details.push({
                    dish_id: i,
                    quantity: orders[i]
                })
            }
        }

        console.log(order_details);
        const email = ReactSession.get('email')
        const requestBody = {
            user_id: email,
            room_id: '102',
            order_details: order_details
        }
        console.log(requestBody);
        axios.post('https://q7rplzgt5w6ab6rcd726pr3p3q0xkarb.lambda-url.us-east-1.on.aws/', requestBody).then((response) => {
            console.log(response);
            if (response.status === 200) {
                if (response.data.statusCode === 200) {
                    const orderId = response.data.order_id
                    ReactSession.set('order_id', orderId);
                    alert('Order placed successfully!');
                    navigate("/order-food/status")
                } else {                    
                    alert('Something went wrong! Please try again')
                    return;
                }
            }
        }).catch((err) => {
            console.log(err);
            alert('Something went wrong! Please try again')
            return;
        })
    };


    if (!menu || menu.length < 1) {
        return (
            <div className="loader"></div>
        );
    }

    return (<>
        <section className="section contact-section" id="next">
            <div className="container">
                <div className="row">
                    <div className="col-md-7">
                        <form className="bg-white p-md-5 p-4 mb-5 border">
                            <h2>Menu</h2>
                            <hr></hr>
                            {MenuItems(menu)}
                        </form>
                        <div className="col-md-6 form-group">
                            <button className="btn btn-primary btn-block text-white" onClick={(e) => handleSubmit(e)}>Order</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>);

    function Item(props) {
        return (<>
            <div className="row">
                <div className="col-md-12 form-group">
                    <h3>{props.item.dish_name}</h3>
                    <label className="text-black font-weight-bold" > Price {props.item.price}</label>
                    <input type="number" defaultValue={0} name={props.item.dish_id} id={props.item.dish_id}
                        onChange={(e) => handleChange(e)} min={0}
                        className="form-control" style={{ width: '80px' }} />
                    <hr></hr>
                </div>
            </div>
        </>)
    }

    function MenuItems(menu) {
        const items = menu
        let menuItems = []
        for (let item in items) {
            menuItems.push(
                <Item key={item} item={items[item]} />
            )
        }
        return menuItems;
    }
}