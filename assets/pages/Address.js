import React from 'react'

const Address = () => {
  return (
    <div className="jumbotron col-12 col-md-12">
        <img src="../../leisure/images/logo_blue.jpg" className="center"/>
        <h3 className="slogan">DREAM TRAVEL AT CHEAPEST COST...</h3>
        <div className="info-address">
            <ul className="info-list">
                <li>
                    <span className="info-item" data-uk-icon="location"></span>
                    <div className="info-list-item">
                        <p style={{fontSize: "14px"}}>Ulaanbaatar, Mongolia.</p>
                    </div>
                </li>
                <li>
                    <span className="info-item" data-uk-icon="receiver"></span>
                    <div className="info-list-item">
                        <span className="info-title">Telephone</span>
                        <p>+976 8858-0022</p>
                    </div>
                </li>
                <li>
                    <span className="info-item" data-uk-icon="mail"></span>
                    <div className="info-list-item">
                        <span className="info-title">Email</span>
                        <p>iharrymg@gmail.com</p>
                    </div>
                </li>
                <li>
                    <span className="info-item" data-uk-icon="facebook"></span>
                    <div className="info-list-item">
                        <span className="info-title">Social</span>
                        <p><a style={{color: "#0075FF"}} href="https://www.facebook.com/iharrymg" target="_blank">www.facebook.com/iharrymg</a></p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
  )
}

export default Address