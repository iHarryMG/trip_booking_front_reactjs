import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleCustomUKModal } from '../main/App';


const PaymentConfirm = () => {

    const { confirm_param } = useParams();
    const navigate = useNavigate();
    const [resultItems, setResultItems] = useState([]);
    let flag = null;
    

    useLayoutEffect( () => {
        UIkit.modal("#loading_cover").show();

        const data = JSON.parse(confirm_param);
        createInvoice(data);
    }, []);
    
    useEffect( () => {
        $("#and-ds div").remove();
        if(resultItems.is_prod === true){
            ANDDS.button({
                "container": "and-ds",
                "invoiceNumber" : resultItems.invoice_number,
                "amount" : resultItems.total_amount,
                "qr_string": resultItems.qr_string,
                "qr_link": resultItems.qr_link
            });
        }else{
            $("#and-ds").append('<div class="button-and-ds">Proceed</div>');
            $(".button-and-ds").on('click', function(){
                document.location.href = `/webhook/${resultItems.invoice_number}/${resultItems.total_amount}`;
            });
        }

        $(".button-and-ds").hide();
        $("#and-ds").append('<div class="button-and-ds-f">Proceed</div>');
        
        $(".button-and-ds-f").on('click', function(){
            if($( "#tc_confirm:checked" ).length < 1){
                handleCustomUKModal('open', 'You must read and agree to the terms of service.');
            }else if(flag === undefined || flag === null || flag < 1){
                handleCustomUKModal('open', 'You need to confirm your email address to receive travel bookings. Make sure your email address is correct and click OK.');
            }
        });
        
        $("#tc_confirm").on('change', function() {                
            if($( "#tc_confirm:checked" ).length > 0 && flag !== undefined && flag !== null && flag > 0){
                $(".button-and-ds").show();
                $(".button-and-ds-f").hide();
            }else{
                $(".button-and-ds").hide();
                $(".button-and-ds-f").show();
            }
        });
        
        $("#email_ok").on('click', function(){
            if($("#email").val() === undefined || $("#email").val() === null || $("#email").val() === ''){
                handleCustomUKModal('open', 'You will need to enter your email address to receive travel bookings. <br/>Please enter your email.');
            }else{
                var data = {
                    user_id : $("#user_id").val(),
                    email : $("#email").val(),
                };

                sendAjaxRequest('/email/update', data, function(data, status, xhr){
                    if(status === 'success'){
                        if(data.result > 0){
                            handleCustomUKModal('open', 'Your email has been verified.');
                            
                            $("#email_ok").removeClass("uk-button-primary");
                            $("#email_ok").addClass("uk-button-default");
                            
                            if($( "#tc_confirm:checked" ).length > 0){
                                $(".button-and-ds").show();
                                $(".button-and-ds-f").hide();
                            }else{
                                flag = data.result;
                                $(".button-and-ds").hide();
                                $(".button-and-ds-f").show();
                            }
                        }else{
                            handleCustomUKModal('open', 'Failed to save email info. <br/>Status:'+status+', Data:'+data);
                        }
                    }else{
                        console.log('status: ' + status + ', data: ');
                        console.log(data);
                        handleCustomUKModal('open', 'Failed to save email info. <br/>Status:'+status+', Data:'+data);
                    }
                }, function(jqXhr, textStatus, errorMessage){
                    console.log('Error' + errorMessage);
                    handleCustomUKModal('open', 'Failed to save email info. <br/>Error message:'+errorMessage);
                });
            }
        });


    }, [resultItems]);

    const createInvoice = (data) => {
          
        const formData = new FormData();
        formData.append("trip_id", data.trip_id);
        formData.append("hotel_id", data.hotel_id);
        formData.append("adult_count", data.adult_count);
        formData.append("children_count", data.children_count);
        formData.append("children_age", data.children_age);
        formData.append("car_id", data.car_id);
        formData.append("select_rooms", JSON.stringify(data.select_rooms));
        
        axios.post('/invoice/create', formData).then((res) => {
          UIkit.modal("#loading_cover").hide();
          
          if(res.status === 200){
            handlePaymentConfirmation(res.data);
          }else{
            $("#wrapper-fail").show();
            $("#wrapper-success").hide();
            UIkit.modal("#loading_cover").hide();
            handleCustomUKModal("open", "Failed to create invoice. <br/>Status code: "+res.status+", Error message: "+res.statusText);
          }
        }); 
    }

    const handlePaymentConfirmation = (data) => {
        const formData = new FormData();
        formData.append("trip_data", JSON.stringify(data));
    
        axios.post('/pay/confirm', formData).then((res) => {
          if(res.status === 200){
            $("#wrapper-fail").hide();
            $("#wrapper-success").show();
            UIkit.modal("#loading_cover").hide();
            setResultItems(res.data);

            if(res.data.user_info[0].email !== null || res.data.user_info[0].email != ''){
                $("#email").val(res.data.user_info[0].email);
            }
          }else{
            $("#wrapper-fail").show();
            $("#wrapper-success").hide();
            UIkit.modal("#loading_cover").hide();
            handleCustomUKModal("open", "Failed to get confirmation info. <br/>Status code: "+res.status+", Error message: "+res.statusText);
          }
        }); 
    }
    
    const formatNumber = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    return (
        <>
            { resultItems != '' &&
                <div className="wrapper"  id="wrapper-success" style={{display: "none"}}>
                    <div className="uk-modal-header confirm-info-header">
                        <img src="../../leisure/images/confirm.png" className="center" />
                        <h4 style={{ textAlign: "center", margin: "5px 0 10px 0", fontWeight: "bold" }} >
                            Booking confirmation
                        </h4>
                        <table style={{ width: "100%", margin: "auto"}} >
                            <tbody>
                                <tr className="table-value">
                                    <td style={{ width: "10%", textAlign: "left", fontSize: "14px"}} ><i className="fa fa-user "></i></td>
                                    <td style={{ width: "30%", textAlign: "left", fontSize: "14px"}}>Adults: </td>
                                    <td style={{ width: "60%", textAlign: "left", fontSize: "14px"}} id="adult_qty">{ resultItems.adult_count }</td>
                                </tr>
                                <tr className="table-value">
                                    <td style={{ width: "10%", textAlign: "left", fontSize: "14px"}} ><i className="fa fa-user "></i></td>
                                    <td style={{ width: "30%", textAlign: "left", fontSize: "14px"}}>Children: </td>
                                    <td style={{ width: "60%", textAlign: "left", fontSize: "14px"}} id="child_qty">
                                        { Number(resultItems.children_count) > 0 ?  resultItems.children_count+" ( Age "+resultItems.children_age+" year old)" : 0}
                                    </td>
                                </tr>
                                { resultItems.car_direction &&
                                    <tr className="table-value">
                                        <td style={{ width: "10%", textAlign: "left", fontSize: "14px"}} ><i className="fa fa-car "></i></td>
                                        <td style={{ width: "30%", textAlign: "left", fontSize: "14px"}}>Rent car: </td>
                                        <td style={{ width: "60%", textAlign: "left", fontSize: "14px"}} id="car_info">
                                        { resultItems.car_direction }, { resultItems.car_way } way
                                        </td>
                                    </tr>
                                }
                                <tr className="table-value">
                                    <td style={{ width: "10%", textAlign: "left", fontSize: "14px"}} ><i className="fa fa-envelope"></i></td>
                                    <td colSpan="2" style={{ width: "90%", textAlign: "left", fontSize: "14px" }} >
                                        { resultItems.user_info &&
                                            <>
                                            <input type="hidden" name="user_id" id="user_id" value={resultItems.user_info[0].id} />
                                            <input type="text" name="email" id="email" style={{width: "70%"}} className="uk-input uk-form-small" placeholder="Email" />                                
                                            </>  
                                        }
                                        { !resultItems.user_info &&
                                            <input type="text" name="email" id="email" style={{ width: "70%"}} className="uk-input uk-form-small" placeholder="Email" />
                                        }
                                        <button id="email_ok" className="uk-button uk-button-primary uk-button-small">OK</button>
                                    </td>
                                </tr>
                                <tr className="table-value">
                                    <td colSpan="3" style={{ width: "100%", textAlign: "left", fontSize: "12px" }} >
                                        Please confirm your email and <span style={{ color: "#1e87f0"}} >click ОК</span>!
                                        <br/>If not, please type your valid email above and click ОК.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="uk-modal-footer confirm-info-footer">
                        { resultItems.trip_info &&
                            <table style={{ width: "95%", margin: "auto", fontSize: "14px"}} >
                            <tbody>
                                <tr>
                                    <td>Travel to {resultItems.trip_info.city_name}, { resultItems.trip_info.country_name }:</td>
                                    <td id="trip_amount" style={{textAlign: "right"}} >{ formatNumber(resultItems.trip_amount) } MNT</td>
                                </tr>
                                <tr>
                                    <td>Rent car booking:</td>
                                    <td id="car_amount" style={{textAlign: "right"}} >
                                    { resultItems.car_total_amount > 0 ? formatNumber(resultItems.car_total_amount)+'MNT' : 'No car reservation' }
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ fontSize: "18px", fontWeight: "800"}} >Total Price:</td>
                                    <td id="pay_amount" style={{ textAlign: "right", fontSize: "18px", fontWeight: "800"}} >{ formatNumber(resultItems.total_amount) } MNT</td>
                                </tr>
                            </tbody>
                            </table>
                        }
                    </div>
                    <div className="uk-modal-footer confirm-info-footer">
                        <div className="checkbox checkbox-success" style={{ float: "none", width: "100%"}} >
                            <input id="tc_confirm" className="styled" type="checkbox" />
                            <label htmlFor="tc_confirm">
                                I agree with the <a href="#modal-overflow" style={{ color: "#1e87f0", textDecoration: "underline"}}  uk-toggle="" >Terms of Service</a>.
                            </label>
                        </div>
                    </div>
                    <div className="uk-modal-footer confirm-info-footer uk-text-right" id="and-ds" style={{ paddingTop: "20px", paddingBottom: "20px" }}></div>
                </div>
            }
            { resultItems == '' &&
                <div className="wrapper" id="wrapper-fail" style={{display: "none"}}>
                    <div className="uk-modal-header confirm-info-header">
                        <img src="../../leisure/images/fail.png" className="center" />
                        <h4 style={{ textAlign: "center", margin: "5px 0 10px 0" }} >
                            Failed to create invoice.<br/>Please go back and try again.
                        </h4>
                        <button onClick={ () => navigate(-1)} className="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom">Go back</button>
                    </div>
                </div>
            }
        </>
    )
}

export default PaymentConfirm