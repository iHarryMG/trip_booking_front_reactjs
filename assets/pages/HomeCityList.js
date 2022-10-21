import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { NavContext } from '../main/Context';

const HomeCityList = ({country_id, is_one_item}) => {
    const API_URL = "http://localhost:8000/get/city";
    const [countryListItems, setCountryListItems] = useState([]);
    const [oneItem, setOneItem] = useState([]);
    const { setNavIDs } = useContext(NavContext);

    useEffect( () => {

        const fetchCountryList = async () => {
            try{
                const data = { country_id: country_id, is_one_item: is_one_item}
                const postOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data) 
                }
        
                const result = await fetch(API_URL, postOptions);
                const jsonResult = await result.json();
                setCountryListItems(jsonResult.result);
                setOneItem(jsonResult.is_one_item);
            }catch(err){
                console.log(err);
            }
        }

        fetchCountryList();
    }, [])

    const handleSetNavID = (city_id, country_id) => {
        setNavIDs({
            city_id: city_id,
            country_id: country_id
        });
    }

    return (
        <>
            { oneItem === 1 && 
                countryListItems.map((item, index) => 
                    <Link key={index} to={ `/hotels/${item.id}/${item.country_id}` } onClick={() => handleSetNavID(item.id, item.country_id)}>
                        <ul className="uk-slider-items uk-child-width-1-3@s uk-child-width-1-4@">
                            <li className="one-item">
                                <div className="uk-panel">
                                    <img src={ "leisure/images" + item.city_img } style={{ width: "100%", height: "100%" }} />
                                    <p>{ item.city_name }</p>
                                </div>
                            </li>
                        </ul>
                    </Link>
                )
            }
            <ul className="uk-slider-items uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-3@m ">
                { oneItem === 0 && 
                    countryListItems.map((item, index) => 
                        <li key={index}>
                            <div className="uk-panel">
                                <Link to={ `/hotels/${item.id}/${item.country_id}` } onClick={() => handleSetNavID(item.id, item.country_id)}>
                                    <img src={ "leisure/images" + item.city_img } />
                                    <p>{ item.city_name }</p>
                                </Link>
                            </div>
                        </li>
                    )
                }   
            </ul>
        </>
    )
}

export default HomeCityList