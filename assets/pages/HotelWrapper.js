import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavContext } from '../main/Context';

const HotelWrapper = (Component) => ({...props}) => {

    const { trip_id, hotel_id, is_special } = useParams();
    const navigate = useNavigate();
    const { setNavIDs } = useContext(NavContext);

    return(
            <Component 
                {...props}
                trip_id={trip_id}
                hotel_id={hotel_id}
                is_special={is_special}
                navigate={navigate}
                setNavIDs={setNavIDs}
            />
    )
}

export default HotelWrapper