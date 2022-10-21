import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { NavContext } from '../main/Context';

const HomeBannerList = ( { is_special, is_active}) => {
    const [items, setItems] = useState([]);
    const { setNavIDs } = useContext(NavContext);

    useEffect( () => {

        const fetchBanners = async () => {
            try{
                const data = { is_special: is_special, is_active: is_active }
                const postOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data) 
                }
        
                const result = await fetch('/get/banner', postOptions);
                const jsonResult = await result.json();
                setItems(jsonResult.result);
            }catch(err){
                console.log(err);
            }
        }

        fetchBanners();
    }, [])

    const handleSetNavID = (hotel_id, trip_id, is_special) => {
        setNavIDs(prev  => ({
            ...prev,
            hotel_id: hotel_id,
            trip_id: trip_id,
            is_special: is_special,
        }));
    }

    return (
        <>
            <ul className="uk-slider-items uk-grid banner-slider">
                { items.map((item, index) =>
                    <li key={index} className="uk-width-4-5">
                        <div className="uk-panel">
                            <Link to={ `/hotel/${item.hotel_id}/${item.trip_id}/${item.is_special}` } onClick={() => handleSetNavID(item.hotel_id, item.trip_id, item.is_special)} >
                                <img src={ "/leisure/images/hotel/"+item.hotel_img } style={{width: "314px", height: "196px", left: "9px"}} alt="" />
                                <p className="banner-title"></p>
                            </Link>
                        </div>
                    </li>
                )}
            </ul>
        </>
    )
}

export default HomeBannerList