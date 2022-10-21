import React from 'react'

const Splash = () => {
  return (
    <>
        <div className="col-12 col-md-12">
            <img src="../../leisure/images/logo_blue.jpg" className="center"/>
            <div className="splash_info">
                Welcome to Trip Booking.
            </div>
            <progress id="js-progressbar" className="uk-progress" value="10" max="200"></progress>
        </div>
        <div className="copyright-content clearfix">
            <div className="widget">
                <p className="copyright hidden-xs hidden-sm">©All rights reserved<br/> Bayarmagnai 2019-2022</p>
            </div>					
        </div>
        <form id="forward_to_home" action="{{ path('home') }}" method="post">
            <input type="hidden" name="code" value="{{code}}" />
        </form>
    </>
  )
}

export default Splash