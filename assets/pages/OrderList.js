import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { handleCustomUKModal } from '../main/App';
import { format } from 'date-fns';

const OrderList = () => {

  const [ orderItems, setOrderItems ] = useState([]);

  useEffect( () => {
    axios.post('/order/list').then((res) => {      
      if(res.status === 200){
        setOrderItems(res.data.orderList);
      }else{
        handleCustomUKModal("open", "Couldn't get order list. <br/>Please try again. Status code: "+res.status+", Error message: "+res.statusText);
      }
    }); 

  }, []);

  return (
    <>
      { orderItems != '' && orderItems != null 
        ?
          <div className="order_list">
          { orderItems.map( item => 
              <div key={item.order_trip_id} className="jumbotron col-12 col-md-12">
                  <div className="list-item-1">
                      <Link to={`/orders/${item.order_trip_id}`}>
                          <table style={{ width:"100%" }}>
                            <tbody>
                              <tr>
                                  <th colSpan="3" style={{ width:"80%", paddingTop: "10px" }}>Travel to {item.city_name}, {item.country_name}</th>
                                  <th rowSpan="2" style={{ width:"20%", borderLeft: "1px solid #c3c3c338", borderWidth: "thin" }}>
                                    <div style={{ width:"20px", textAlign: "right" }}><i className="fa fa-angle-right fa-lg"></i></div>
                                  </th>
                              </tr>
                              <tr className="table-value">
                                  <td style={{ width:"20%", textAlign: "left", fontSize: "14px" }}>No.{item.order_trip_id}</td>
                                  <td style={{ width: "50%", textAlign: "left", fontSize: "14px", color: "#00BB07"}}>
                                      { (item.order_status == 'PAID' || item.order_status == 'invoice.paid')
                                        ? <span style={{ color: "#00BB07" }}>Booking completed</span>
                                        : (item.order_status == 'PROCESSING'
                                        ? <span style={{ color: "#dc3545" }}>Pending</span>
                                        : <span style={{ color: "#dc3545" }}>{item.order_status}</span>
                                        )
                                      }
                                  </td>
                                  <td style={{ width: "25%", textAlign: "left", fontSize: "14px" }}>{format(new Date(item.updated_at), 'yyyy-MM-dd')}</td>  
                              </tr>
                            </tbody>
                          </table>
                      </Link>
                  </div>
              </div>
          )}
          </div>
          
      :
          <div className="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin" uk-grid="">
              <p className="no-result">There is no trip history.</p>
          </div>
          
      }
    </>
  )
}

export default OrderList