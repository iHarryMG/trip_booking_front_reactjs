import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { NumericFormat } from 'react-number-format';
import '../styles/hotel_list.css';
import { NavContext } from '../main/Context';

const HotelList = () => {

    const { city_id, country_id, date } = useParams();
    const [tripItems, setTripItems] = useState([]);
    const [dateItem, setDateItem] = useState([]);
    const { setNavIDs } = useContext(NavContext);

    const months = {
      0: 'January',
      1: 'February',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'July',
      7: 'August',
      8: 'September',
      9: 'October',
      10: 'November',
      11: 'December',
    }

    const dateFilterStyle_UkSlider = {
        margin: "0 15px",
        paddingTop: "10px"
    }

    const dateFilterStyle_UkSliderItems_li = {
        height: "88px",
        borderRadius: ".3rem",
        margin: "0 5px 5px 0",
        background: "#FFFFFF",
        boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.1)",
        color: "#333"
    }

    const runHotelRating = (item) => {
      const starts = [];
      for (let i = 0; i < item.hotel_star; i++){
        starts.push(<i key={i+1} className="fa fa-star voted"></i>);
      }
      return starts;
    }

    useEffect( () => {

        const fetchCountryList = async () => {
            try{
              const data = { city_id: city_id, country_id: country_id, date: date }
              const postOptions = {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(data) 
              }
      
              const result = await fetch('/hotel/list', postOptions);
              const jsonResult = await result.json();              
              setTripItems(jsonResult.result);
              setDateItem(jsonResult.date_set);

            }catch(err){
                console.log(err);
            }
        }

        fetchCountryList();
    }, [])

    const handleSetNavID = (hotel_id, trip_id, is_special) => {
        setNavIDs(prev  => ({
            ...prev,
            city_id: city_id,
            country_id: country_id,
            hotel_id: hotel_id,
            trip_id: trip_id,
            is_special: is_special,
        }));
    }

  return (
    <>
        <div className="uk-position-relative uk-visible-toggle uk-light" tabIndex={-1} data-uk-slider="" style={dateFilterStyle_UkSlider}>
          <ul className="hotel-list-filter uk-slider-items uk-child-width-1-4 uk-child-width-1-5@s uk-child-width-1-6@m">
              { dateItem &&
                <>
                    <li style={dateFilterStyle_UkSliderItems_li}>
                        <a href={ `/hotels/${city_id}/${country_id}` } >                
                            <div className="uk-position-center uk-panel list-date">
                                <p className="list-date-date" style={{color: "#757775"}}>All</p>
                                <p className="list-date-date" style={{color: "#757775"}}>travels</p>
                            </div>
                        </a>
                    </li>
                </>
              }
              { dateItem && dateItem.map( (item, index) => 
                    <li key={index} style={dateFilterStyle_UkSliderItems_li}>
                        <a href={ `/hotels/${city_id}/${country_id}/${ item.departure_datetime }`} >
                            <div className="uk-position-center uk-panel list-date">
                                <p className="list-date-month" style={{color: "#757775"}}>{ item.departure_month }</p>  
                                <p className="list-date-day" style={{fontSize: "xx-large", fontWeight: "bold", color: "#757775"}}>{ item.departure_day }</p>
                            </div>
                        </a>
                    </li>     
                  )
                }
          </ul>
        </div>
      
      { tripItems &&
        <div style={{ paddingBottom: "60px!important" }}>
            <div style={{backgroundColor: "#fff",marginTop: "10px"}} className="hotel-list-items uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin" data-uk-grid="">
                <p style={{color: "#0000c9",fontFamily: "Roboto Condensed",padding: "5px",margin: "0", width: "100%", textAlign: "center"}}><span data-uk-icon="info"></span> The price below is a package price for 2 people.</p>
            </div>
          { tripItems.map( (item, index) =>
            <Link key={index} className="wrapper-uk-card" to={ `/hotel/${item.hotel_id}/${item.trip_id}/${item.is_special}` } onClick={() => handleSetNavID(item.hotel_id, item.trip_id, item.is_special)} >
                <div className="hotel-list-items uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin" data-uk-grid="">

                    <div className="uk-card-media-left uk-cover-container">
                        <img src={ `/leisure/images/hotel/${item.hotel_img}` } data-uk-cover="" />
                        <canvas width="600" height="400"></canvas>
                    </div>
                    <div className="list-content">
                        <div className="uk-card-body">
                            <div className="rating">
                                { runHotelRating(item) }
                            </div>
                            
                            <h1 className="uk-card-title">{ item.hotel_name }</h1>
                            <div className="list-info">
                                <p className="hlist-date">
                                  { item.departure_datetime } - { item.arrival_datetime }
                                </p>
                                <p className="hlist-time">
                                    <span><i className="fa fa-plane fa-lg"></i></span>
                                    <span style={{paddingLeft:"5px"}}>{ item.departure_time }</span>
                                    <span style={{paddingLeft:"5px"}}>{ item.night_count } nights
                                        { item.night_count_plus &&
                                          <>
                                            ( +{ item.night_count_plus } )
                                          </>
                                        }
                                    </span>
                                </p>
                                <p className="hlist-price"><span>2 person: </span>
                                      <NumericFormat 
                                        value={ item.price_bb } 
                                        thousandSeparator="," 
                                        displayType="text" 
                                        renderText={(value) => <span>{value}</span>} /> MNT
                                  </p>
                            </div>
                            <div>
                                <i className="fa fa-chevron-right fa-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
          )}
        </div>
      }
      { !tripItems &&
        <div className="hotel-list-items uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin" data-uk-grid="">
            <p className="no-result">Sorry, there isn't any trip yet.</p>
        </div>
      }
    
    </>
  )
}

export default HotelList