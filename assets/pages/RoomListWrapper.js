import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavContext } from '../main/Context';

const RoomListWrapper = (Component) => ({...props}) => {

    const { trip_id, hotel_id, is_special, adult_count, children_count, children_age} = useParams();
    const navigate = useNavigate();
    const { setNavIDs } = useContext(NavContext);

    return(
            <Component 
                {...props}
                navigate={navigate}
                trip_id={trip_id}
                hotel_id={hotel_id}
                is_special={is_special}
                adult_count={adult_count}
                children_count={children_count}
                children_age={children_age}
                setNavIDs={setNavIDs}
            />
    )
}

export default RoomListWrapper