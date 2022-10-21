import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './Header';
import SearchModal from './SearchModal';
import Navbar from './Navbar';
import Home from '../pages/Home';
import OrderList from '../pages/OrderList';
import Advise from '../pages/Advise';
import Address from '../pages/Address';
import Hotel from '../pages/Hotel';
import HotelList from '../pages/HotelList';
import RoomList from '../pages/RoomList';
import HotelWrapper from '../pages/HotelWrapper'; 
import RoomListWrapper from '../pages/RoomListWrapper'; 
import Photo from '../pages/Photo';
import PaymentConfirm from '../pages/PaymentConfirm';
import OrderResult from '../pages/OrderResult';
import ServiceTerms from '../pages/ServiceTerms';
import OrderDetail from '../pages/OrderDetail';

import { NavContext } from './Context';

function App() {

    const HotelComponent = HotelWrapper(Hotel);    
    const RoomListComponent = RoomListWrapper(RoomList);   
    const [navIDs, setNavIDs] = useState({});

    return (
        <>
            <NavContext.Provider value={{ navIDs, setNavIDs }}>
                <Header />
                <main role="main" className="container">
                    <Routes>
                        <Route path="/" element={ <Home /> } >
                            <Route index element={ <Home />}/>
                        </Route>
                        <Route path="hotels/:city_id/:country_id" element={ <HotelList /> }/>
                        <Route path="hotels/:city_id/:country_id/:date" element={ <HotelList /> }/>
                        <Route path="hotel/:hotel_id/:trip_id/:is_special" element={ <HotelComponent /> }/>
                        <Route path="rooms/:hotel_id/:trip_id/:is_special/:adult_count/:children_count/:children_age" 
                               element={ <RoomListComponent />}
                        />
                        <Route path="photo/:photo_param" element={ <Photo /> } />
                        <Route path="confirm/:confirm_param" element={ <PaymentConfirm /> } />
                        <Route path="result" element={ <OrderResult /> }/>
                        <Route path="orders" element={ <OrderList /> }/>
                        <Route path="orders/:order_id" element={ <OrderDetail /> }/>
                        <Route path="advise" element={ <Advise /> }/>
                        <Route path="address" element={ <Address /> }/>
                    </Routes>
                </main>
                <Navbar />
                <SearchModal />
            </NavContext.Provider>
            <ServiceTerms />
            <div className="hotel-detail-modal" id="modal-sections" data-uk-modal="">
                <div className="uk-modal-dialog">
                    <button className="uk-modal-close-default" type="button" data-uk-close="" ></button>
                    <div className="uk-modal-header" style={{ height: "45px" }}>
                        {/* {#<h4 className="uk-modal-title">Хүний тоо</h4>#} */}
                    </div>
                    <div className="hotel-detail-modal-body uk-modal-body">
                        <ul id="person-count">
                            <li>
                                <div className="col-12" style={{ height:"40px", marginBottom: "10px" }}>
                                    <div className="col-6" style={{ float:"left", height: "100%", paddingTop: "5px" }} >Adult</div>

                                    <div id="dataTable_filter" className="dataTables_filter">
                                        <div className="btn-group hotel-create-dropdown" id="adult_qty">
                                            <button adult-qty="2" type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                2 adults
                                            </button>
                                            <div className="dropdown-menu">
                                                <a className="dropdown-item" href="#" adult-qty="1">1</a>
                                                <a className="dropdown-item" href="#" adult-qty="2">2</a>
                                                <a className="dropdown-item" href="#" adult-qty="3">3</a>
                                                <a className="dropdown-item" href="#" adult-qty="4">4</a>
                                                <a className="dropdown-item" href="#" adult-qty="5">5</a>
                                                <a className="dropdown-item" href="#" adult-qty="6">6</a>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </li>
                            <li>
                                <div className="col-12" style={{ height:"40px" }}>
                                    <div className="col-6" style={{ float:"left", height: "100%", paddingTop: "5px" }} >Children</div>

                                    <div id="dataTable_filter" className="dataTables_filter">
                                        <div className="btn-group hotel-create-dropdown" id="child_qty">
                                            <button child-qty="0" type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                0 children
                                            </button>
                                            <div className="dropdown-menu">
                                                <a className="dropdown-item" href="#" child-qty="0">0</a>
                                                <a className="dropdown-item" href="#" child-qty="1">1</a>
                                                <a className="dropdown-item" href="#" child-qty="2">2</a>
                                                <a className="dropdown-item" href="#" child-qty="3">3</a>
                                                <a className="dropdown-item" href="#" child-qty="4">4</a>
                                                <a className="dropdown-item" href="#" child-qty="5">5</a>
                                                <a className="dropdown-item" href="#" child-qty="6">6</a>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </li>
                        </ul>
                        <ul id="children_age_list">
                        </ul>
                    </div>
                    <div className="uk-modal-footer uk-text-right">
                        <button id='person_qty_cancel' className="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                        <button id='person_qty_ok' className="uk-button uk-button-primary" type="button">ОК</button>
                    </div>
                </div>
            </div> 
            <div id="carinfo-modal-sections" data-uk-modal=""></div>
            <div id="custom-uk-modal" className="uk-modal" style={{display: "none"}}> 
                <div className="uk-modal-dialog"> 
                    <div className="uk-modal-body">
                    </div> 
                    <div className="uk-modal-footer uk-text-right"> 
                        <button className="uk-button uk-button-primary uk-modal-close" autoFocus="">Ok</button> 
                    </div>
                </div>
            </div>
            <div id="modal-information" uk-modal="">
                <div className="uk-modal-dialog">
                    <button className="uk-modal-close-default" type="button" uk-close=""></button>
                    <div className="uk-modal-header" style={{height: "45px"}}>
                    </div>
                    <div className="uk-modal-body">
                        Sorry, it is not possible to order at this time. You can book a tour from Monday to Friday from 10:00am to 08:00pm and on Saturday from 11:00am to 06:00pm.
                    </div>
                    <div className="uk-modal-footer uk-text-right">
                        <button className="uk-button uk-button-default uk-modal-close" type="button">Understood</button>
                    </div>
                </div>
            </div>
            <div id="loading_cover" className="uk-flex-top" data-uk-modal="">
                <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
                    <button className="uk-modal-close-default" type="button" data-uk-close=""></button>
                    <p>Please wait a moment. Loading...</p>
                    <div data-uk-spinner=""></div>
                </div>
            </div>
        </>
    );
}
  
export default App;

export function handleCustomUKModal (flag, text) {
    if(flag === "open"){
        $("#custom-uk-modal .uk-modal-body span").remove();
        $("#custom-uk-modal .uk-modal-body").append($("<span>"+text+"</span>"));
        UIkit.modal("#custom-uk-modal").show();
    }else if (flag === "close"){
        $("#custom-uk-modal .uk-modal-body span").remove();
        UIkit.modal("#custom-uk-modal").hide();
    }else{
        console.log('Flag is not defined!');
        return false;
    }
}