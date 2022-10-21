import React, { useEffect, useState } from 'react'
import HomeBannerList from './HomeBannerList'
import HomeCityList from './HomeCityList'

const Home = () => {
    const [countryListItems, setCountryListItems] = useState([]);
    
    useEffect( () => {

        const fetchCountryList = async () => {
            try{
                const data = { code: 'YzhmNTk1NDg5MGI3YmZmMTA4NTZjZWVmYTkyMmZmZDFkNDc5MzE1NTkzMTAzNTIyY2M5NTczMGVjNmJhZjYzYQ'}
                const postOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data) 
                }
        
                const result = await fetch('/home', postOptions);
                const jsonResult = await result.json();
                setCountryListItems(jsonResult.result);
                
            }catch(err){
                console.log(err);
            }
        }

        fetchCountryList();
    }, [])

    return (
        <>
            <div className="banner-container uk-position-relative uk-visible-toggle uk-light" tabIndex={-1} data-uk-slider="">
                <HomeBannerList 
                    is_special={1}
                    is_active={1}
                />
            </div> 
            <div id="content-wrapper">        
                { countryListItems.map( (item, index) =>
                    <div key={index} className="jumbotron col-12 col-md-12">
                        <div className="jumbotron-title">
                            <img src={ "/leisure/images/flag/"+item.country_img } />                            
                            <p>{ item.country_name }</p>
                        </div>
                        <div data-uk-slider="">
                            < HomeCityList 
                                country_id={item.id}
                                is_one_item={item.is_one_item}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Home