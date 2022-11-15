import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { handleCustomUKModal } from '../main/App';
import { format } from 'date-fns';

const OrderDetail = () => {

    const { order_id } = useParams();
    const [ resultItem, setResultItem ] = useState([]);

    useEffect( () => {

        const formData = new FormData();
        formData.append("order_id", order_id);

        axios.post('/order/detail', formData).then((res) => {      
            if(res.status === 200){
                setResultItem(res.data);
            }else{
                handleCustomUKModal("open", "Couldn't get order detail. <br/>Please try again. Status code: "+res.status+", Error message: "+res.statusText);
            }
        }); 

    }, []);
    
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    const runHotelRating = (item) => {
        const starts = [];
        for (let i = 0; i < item.hotel_star; i++){
          starts.push(<i key={i+1} className="fa fa-star voted"></i>);
        }
        return starts;
    }

    return (
        <>
            { resultItem.orderDetail &&     
                <div className="jumbotron col-12 col-md-12 order-detail-info">
                    <div className="info-service">
                        <p className="info-title">Travel package info:</p>
                        { resultItem.orderDetail.map( (item, index) =>
                            <ul className="info-list" key={index} >
                                <li>
                                    <i className="fa fa-plane fa-lg"></i>
                                    <div className="info-list-item">
                                        <p className="info-list-item-title">{item.country_name} country, {item.city_name}</p>
                                        <p>{item.direction} { item.departure_datetime } - { item.arrival_datetime }</p>
                                    </div>
                                </li>
                                <li>
                                    <i className="fa fa-building-o fa-lg" style={{ marginTop: "15px" }}></i>
                                    <div className="info-list-item hotel-info">
                                        <p className="info-list-item-title">
                                            <span className='hotel-name'>
                                                {item.hotel_name} hotel &nbsp;&nbsp;
                                            </span>
                                            { (item.hotel_name.length > 20) &&
                                                <br/>
                                            }
                                            <span className="rating">
                                                { runHotelRating(resultItem.orderDetail[0]) }
                                            </span>
                                        </p>
                                        <p>{item.adult_count} adults
                                            { item.children_count != null && item.children_count != '' && item.children_count > 0 &&
                                                <>, {item.children_count} children</>
                                            }
                                        </p>
                                    </div>
                                </li>
                                <li className="last-item" style={{ borderBottom: "0" }}>
                                    <i className="fa fa-umbrella fa-lg"></i>
                                    <div className="info-list-item">
                                        <p className="info-list-item-title">Travel insurance</p>
                                        <p>{item.insurance}</p>
                                    </div>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            }
            { resultItem.rooms &&
                <div className="jumbotron col-12 col-md-12 order-detail-info">
                    <div className="info-service">
                        <p className="info-title">Room info:</p>
                        <ul className="info-list">
                            { resultItem.rooms.map( (item, index) => 
                                <li key={index}>
                                    <i className="fa fa-bed fa-lg"></i>
                                    <div className="info-list-item">
                                        <table style={{width: "100%" }}>
                                            <tbody>
                                                <tr>
                                                    <th style={{ color: "#000 !important" }}>{ item.room_name }</th>
                                                </tr>
                                                <tr className="table-value">
                                                    <td style={{ fontSize: "14px" }}><span>{ item.room_qty } room</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            }
                
            { resultItem.car_info &&
                <div className="jumbotron col-12 col-md-12 order-detail-info">
                    <div className="info-service">
                        <p className="info-title">My booking info:</p>
                        <ul className="info-list">
                            { resultItem.car_info.map( (item, index) => 
                                <li key={index}>
                                    <i className="fa fa-car fa-lg"></i>
                                    <div className="info-list-item">
                                        <table style={{ width: "100%" }}>
                                            <tbody>
                                                <tr>
                                                    <th style={{ color: "#000 !important" }}>{ item.car_direction } direction</th>
                                                </tr>
                                                <tr className="table-value">
                                                    <td style={{ fontSize: "14px" }}><span>{ item.way } way</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            }
            
            { resultItem.orderDetail &&
                <div className="payment-info jumbotron col-12 col-md-12 order-detail-info">
                    <div className="info-service">
                        <p className="info-title">Payment info:</p>
                        <ul className="info-list">
                            { resultItem.orderDetail.map( (item, index) => 
                                <li key={index}>
                                    <i className="fa fa-check fa-lg"></i>
                                    <div className="info-list-item">
                                        <table style={{ width: "100%" }}>
                                            <tbody>
                                                <tr>
                                                    <th>{ formatNumber(item.total_amount) }₮</th>
                                                </tr>
                                                <tr className="table-value">
                                                    <td style={{ fontSize: "14px", color: "#00BB07" }}>
                                                        { (item.order_status == 'PAID' || item.order_status == 'invoice.paid')
                                                            ? <span style={{ color: "#00BB07" }}>Paid</span>
                                                            : (item.order_status == 'PROCESSING'
                                                            ? <span style={{ color: "#dc3545" }}>Pending</span>
                                                            : <span style={{ color: "#dc3545" }}>{item.order_status}</span>
                                                            )
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            }

        </>
    )
}

export default OrderDetail