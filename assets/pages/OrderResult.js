import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const OrderResult = () => {

    const [ searchParams ] = useSearchParams();
    const [ paymentStatus, setPaymentStatus ] = useState(null);
    
    useEffect( () => {
        setPaymentStatus(Number(searchParams.get("payment_status")));
    }, []);

    return (
        <div className="wrapper">
            <div className="uk-modal-header confirm-info-header">
                { paymentStatus === 1 && //Амжилттай
                    <>
                        <img src="../../leisure/images/confirm.png" className="center"/>
                        <h3 style={{ textAlign: "center"}} >
                            { searchParams.get("description") }
                        </h3>
                        <p style={{ textAlign: "center", marginTop: "10px"}} >
                            <span>We will confirm your order within <span style={{ fontSize: "18px", fontWeight: "bold"}} >30 min</span> and inform you by email whether the trip is confirmed or not.</span><br/>
                        </p>
                    </>
                }
                { paymentStatus < 0 && //Нэхэмжлэх үүсээгүй
                    <>
                        <img src="../../leisure/images/attention.png" className="center"/>
                        <h3 style={{ textAlign: "center"}} >
                            { searchParams.get("description") } Код:{ paymentStatus }
                        </h3>
                        <p style={{ textAlign: "center", marginTop: "10px"}} >
                            <span>Please try again.</span><br/>
                        </p>
                    </>
                }
                { paymentStatus === 0 &&  //Pending
                    <>
                        <img src="../../leisure/images/attention.png" className="center"/>
                        <h3 style={{ textAlign: "center" }} >
                            { searchParams.get("description") } Код:{ paymentStatus }
                        </h3>
                    </>
                }
                { paymentStatus > 1 && paymentStatus < 5 && // Cancelled || Expired || Fail
                    <>
                        <img src="../../leisure/images/fail.png" className="center"/>
                        <h3 style={{ textAlign: "center" }} >
                            { searchParams.get("description") } Код:{ paymentStatus }
                        </h3>
                        <p style={{ textAlign: "center", marginTop: "10px"}} >
                            <span>Please try again.</span><br/>
                        </p>
                    </>
                }
                { paymentStatus === 999 &&
                    <>
                        <img src="../../leisure/images/attention.png" className="center"/>
                        <h3 style={{ textAlign: "center" }}>
                            { searchParams.get("description") } Код:{ paymentStatus }
                        </h3>
                        <p style={{ textAlign: "center", marginTop: "10px" }}>
                            <span>Please try again.</span><br/>
                        </p>
                    </>
                }
                { paymentStatus === null &&
                    <>
                        <img src="../../leisure/images/fail.png" className="center"/>
                        <h3 style={{ textAlign: "center" }} >
                            { searchParams.get("description") } Код:{ paymentStatus }
                        </h3>
                        <p style={{ textAlign: "center", marginTop: "10px" }} >
                            <span>Please try again or you can directly contact us.</span><br/>
                        </p>
                    </>
                }
                
                <p style={{ textAlign: "center", marginTop: "10px" }}>
                    <span>Please contact the following number for the booking  information.</span><br/>
                    <span className="result-contact" >(+976) 8858-0022</span><br/>
                </p>
                <Link to="/" className="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom">Go back to Home</Link>
            </div>
        </div>
    )
}

export default OrderResult