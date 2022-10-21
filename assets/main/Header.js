import React, { useEffect, useState, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { NavContext } from './Context';


const Header = () => {

    const location = useLocation();
    const [ pathName, setPathName ] = useState('');
    const { navIDs } = useContext(NavContext);

    useEffect( () => {
        let path = location.pathname;
        setPathName(path);
    }, [location.pathname]);

    return (
        <header id="header">
            <nav className="navbar navbar-expand-md bg-dark mb-3 col-12 col-md-12">
                { (pathName === '/' || pathName === "/orders" || pathName.includes("/advise") || pathName.includes("/address"))
                    ? // Only when at Home
                        <>
                            <div className="header-brand-logo">
                                <a href="#">
                                    <img className="logo" src="/leisure/images/logo_white.png" style={{ paddingLeft: '30px'}} />
                                </a>
                            </div>
                            <div className="top-search">
                                <a href="#search-modal-sections" className="search-toggle uk-button" uk-toggle="" >
                                    <i className="fa fa-search"></i>
                                </a>
                            </div>
                        </> 
                    : // Other cases
                        <>
                            <div className="top-search">
                                { pathName.includes("/hotels/") &&
                                    <Link to={'/'} className="search-toggle"><i className="fa fa-arrow-left fa-lg"></i></Link>
                                }
                                { pathName.includes("/hotel/") && navIDs.city_id === undefined &&
                                    <Link to={'/'} className="search-toggle"><i className="fa fa-arrow-left fa-lg"></i></Link>
                                }
                                { pathName.includes("/hotel/") && (navIDs != null && navIDs.city_id !== undefined) &&
                                    <Link to={`/hotels/${navIDs.city_id}/${navIDs.country_id}`} className="search-toggle"><i className="fa fa-arrow-left fa-lg"></i></Link>
                                }
                                { pathName.includes("/rooms/") &&
                                    <Link to={`/hotel/${navIDs.hotel_id}/${navIDs.trip_id}/${navIDs.is_special}`} className="search-toggle"><i className="fa fa-arrow-left fa-lg"></i></Link>
                                }
                                { pathName.includes("/photo/") &&
                                    <Link to={`/rooms/${navIDs.hotel_id}/${navIDs.trip_id}/${navIDs.is_special}/${navIDs.adult_qty}/${navIDs.child_qty}/${navIDs.children_age}`} className="search-toggle"><i className="fa fa-arrow-left fa-lg"></i></Link>
                                }
                                { pathName.includes("/confirm/") &&
                                    <Link to={`/photo/${navIDs.photo_param}`} className="search-toggle"><i className="fa fa-arrow-left fa-lg"></i></Link>
                                }
                                { pathName.includes("/orders/") &&
                                    <Link to={'/orders'} className="search-toggle"><i className="fa fa-arrow-left fa-lg"></i></Link>
                                }
                            </div>
                            <div className="header-brand-logo">
                                { pathName.includes("/hotels/") &&
                                    <p>Travel list</p>
                                }
                                { pathName.includes("/hotel/") &&
                                    <p>Travel info</p>
                                }
                                { pathName.includes("/rooms/") &&
                                    <p>Room info</p>
                                }
                                { pathName.includes("/photo/") &&
                                    <p>Upload passport photo</p>
                                }
                                { pathName.includes("/confirm/") &&
                                    <p>Payment confirmation</p>
                                }
                                { pathName.includes("/orders/") &&
                                    <p>Booking history</p>
                                }
                            </div>
                        </>
                }
            </nav>
        </header>
        
    )
}

export default Header