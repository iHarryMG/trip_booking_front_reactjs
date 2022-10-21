import React, { useEffect, useLayoutEffect, useState, useContext } from 'react';
import axios from 'axios';
import { handleCustomUKModal } from '../main/App';

const SearchModal = () => {

    const [countryNameItems, setCountryNameItems] = useState([]);

    useLayoutEffect( () => {
        axios.post('/country/list').then((res) => {
          if(res.status === 200){
            setCountryNameItems(res.data.countryNameList);

          }else{
            console.log('Error status code=' + res.status);
            console.log('Error message=' + res.message);
            handleCustomUKModal("open", "Couldn't get country list. <br/>Please refresh page.");
          }
        }); 

    }, []);

    useEffect( () => {

        $( "#inputCountry a.dropdown-item" ).on( "click", function() {
            $('#inputCountry button').text($(this).text());
            $('#country_id').val($(this).attr('country-id'));
            
            getCity($(this).attr('country-id'));
            $('#inputCity button').prop('disabled', false);
        });
         
    }, [countryNameItems])

    useEffect( () => {
        UIkit.util.on('#search_ok', 'click', function (e) {
            e.preventDefault();
            e.target.blur();
          
            let city_id = $("#city_id").val();
            let country_id = $("#country_id").val();
            let date = $("#selected_date").val();
            console.log("city_id: " + city_id +", country_id: "+ country_id+", date: "+ date);

            var form_action = '/hotels/'+city_id+'/'+country_id+'/'+date;
            $("#search_trip").attr('action', form_action);
            $("#search_trip").submit();
        });

    }, [])

    function getCity(country_id){
        sendAjaxRequest('/city/list', {country_id: country_id }, function(data, status, xhr){
            if(status === 'success'){
                $('#inputCity .dropdown-menu a').remove();
                $('#inputCity button').text('Select city');
                
                for (let i = 0; i < $(data.cityNames).length; i++) {
                    $('#inputCity .dropdown-menu').append( 
                        $( '<a class="dropdown-item" city-id="'+data.cityNames[i].id+'">'+data.cityNames[i].city_name+'</a>' ) );
                }
                
                $( "#inputCity a.dropdown-item" ).on( "click", function() {
                    $('#inputCity button').text($(this).text());
                    $('#city_id').val($(this).attr('city-id'));
                    
                    getDate($('#country_id').val(), $('#city_id').val());
                    $('#inputDate button').prop('disabled', false);
                });
            }else{
                console.log('status: ' + status + ', data: ');
                console.log(data);
            }
        }, function(jqXhr, textStatus, errorMessage){
            console.log('Error' + errorMessage);
        });
    }
    
    function getDate(country_id, city_id){

        sendAjaxRequest('/date/list', {country_id: country_id, city_id: city_id }, function(data, status, xhr){
            if(status === 'success'){
                console.log(data.dateList);
                
                $('#inputDate button').text('Select date');
                $('#inputDate .dropdown-menu a').remove();
                
                if($(data.dateList).length > 1){
                    $('#inputDate .dropdown-menu').append( $( '<a class="dropdown-item" selected-date="">All travel</a>' ) );
                }
                
                if($(data.dateList).length > 0){
                    for (let i = 0; i < $(data.dateList).length; i++) {
                        $('#inputDate .dropdown-menu').append( 
                            $( '<a class="dropdown-item" selected-date="'
                                +data.dateList[i].start_date+'">'
                                +data.dateList[i].start_date+'</a>' ) );
                    }
                    
                    $( "#inputDate a.dropdown-item" ).on( "click", function() {
                        $('#inputDate button').text($(this).text());
                        $('#selected_date').val($(this).attr('selected-date'));
                        $('#search_ok').prop('disabled', false);
                    });

                }else{
                    $('#search_ok').prop('disabled', true);
                    $('#inputDate .dropdown-menu a').remove();
                    $('#inputDate .dropdown-menu').append( 
                            $( '<a class="dropdown-item" selected-date="">No travel info</a>' ) );
                    $('#inputDate button').text('No travel info');
                }

            }else{
                console.log('status: ' + status + ', data: ');
                console.log(data);
            }
        }, function(jqXhr, textStatus, errorMessage){
            console.log('Error' + errorMessage);
        });
    }

    return (
        <>
            <div id="search-modal-sections" data-uk-modal="">
                <div className="uk-modal-dialog">
                    <button className="uk-modal-close-default" type="button" data-uk-close="" ></button>
                    <div className="uk-modal-header" style={{height: "45px"}}>
                    </div>
                    <div className="uk-modal-body">
                        <ul id="person-count">
                            <li key="search_1">
                                <div className="form-row col-13">
                                    <div className="form-group search_item1 col-1">
                                        <i className="fa fa-search"></i>
                                    </div>
                                    <div className="form-group search_item1 col-5" id="inputCountry">
                                        <button country-id="" type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            Select country
                                        </button>
                                        <div className="dropdown-menu">
                                            { countryNameItems && countryNameItems.map( (item, index) =>
                                                <a key={index} className="dropdown-item" country-id={ item.id} >{ item.country_name }</a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group search_item1 col-5" id="inputCity">
                                        <button disabled city-id="" type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            Select city
                                        </button>
                                        <div className="dropdown-menu">
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li key="search_2">
                                <div className="form-row col-13">
                                    <div className="form-group search_item1 col-1">
                                        <i className="fa fa-calendar"></i>
                                    </div>
                                    <div className="form-group search_item1 col-10" id="inputDate">
                                        <button disabled selected-date="" type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            Select date
                                        </button>
                                        <div className="dropdown-menu">
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>       
                    </div>
                    <div className="uk-modal-footer uk-text-right">
                        <button disabled id='search_ok' className="uk-width-1-1 uk-button uk-button-primary" type="button">Search</button>
                    </div>
                </div>
            </div>
            <form id="search_trip" action="" method="post">                                
                <input type="hidden"  name="country_id" id="country_id" value=""/>
                <input type="hidden"  name="city_id" id="city_id" value=""/>
                <input type="hidden"  name="date" id="selected_date" value=""/>
            </form>
        </>
    )
}

export default SearchModal