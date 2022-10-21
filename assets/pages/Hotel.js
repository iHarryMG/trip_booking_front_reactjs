import React from 'react';
import '../styles/hotel_detail.css';
import { handleCustomUKModal } from '../main/App';
import PhotoSlider from './PhotoSlider';

class Hotel extends React.Component {

    constructor(props){
        super(props);
    }

    // API_URL = "http://localhost:8000/hotel/detail";
    
    state = {
        photoItems: [],
        roomItems: [],
        serviceItems: []
    }
    
    runHotelRating = (item) => {
        const starts = [];
        for (let i = 0; i < item.hotel_star; i++){
          starts.push(<i key={i+1} className="fa fa-star voted"></i>);
        }
        return starts;
    }
 
    componentDidMount() {

        const fetchHotelItem = async () => {
            try{
                
                const data = { is_special: this.props.is_special, hotel_id: this.props.hotel_id, trip_id: this.props.trip_id }
                const postOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data) 
                }
        
                const result = await fetch('/hotel/detail', postOptions);
                const jsonResult = await result.json();

                this.setState({ serviceItems : jsonResult.service })
                this.setState({ photoItems : jsonResult.photo });
                this.setState({ roomItems : jsonResult.rooms });

            }catch(err){
                console.log(err);
            }
        }

        fetchHotelItem();

        // ########## Modal-Sections popup ############
        
        $("#choose_room").on('click', function(){
            $("#modal-sections ul#children_age_list li").remove();
            UIkit.modal("#modal-sections").show();
        });

        UIkit.util.on('#person_qty_ok', 'click', function (e) {
            e.preventDefault();
            e.target.blur();

            var adult_qty = $("#adult_qty button").attr("adult-qty");
            var child_qty = $("#child_qty button").attr("child-qty");
            var children_age = [];
            
            if(adult_qty === undefined){
                handleCustomUKModal("open", "Please select person quantity!").then(function () {
                    UIkit.modal("#modal-sections").show();
                });;
                return;
            }
            
            var pass = false;
            
            if(child_qty === '0'){
                pass = true;
            }else{
                var buttons = $("#children_age_list").find("li button");
                for(var i=0; i<buttons.length; i++ ){
        
                    if($(buttons[i]).attr('child-age') === undefined){
                        pass = false;
                        break;
                    }else{
                        children_age.push($(buttons[i]).attr('child-age'));
                        pass = true;
                    }
                }
            }
            
            if(pass === true){
                UIkit.modal("#modal-sections").hide();
                handleSubmit(adult_qty,child_qty,children_age)                                
            }else{
                handleCustomUKModal("open", "Please select children's age!").then(function () {
                    UIkit.modal("#modal-sections").show();
                });
            }
            
        });

        
        const handleSubmit = (adult_qty,child_qty,children_age) => {
            try{
                handleSetNavID(this.props.hotel_id, this.props.trip_id, this.props.is_special, adult_qty, child_qty, children_age);
                this.props.navigate(`/rooms/${this.props.hotel_id}/${this.props.trip_id}/${this.props.is_special}/${adult_qty}/${child_qty}/${ child_qty > 0 ? children_age : 0 } `)

            }catch(e){
                console.log(e);
            }
        }

        const handleSetNavID = (hotel_id, trip_id, is_special, adult_qty, child_qty, children_age) => {
            this.props.setNavIDs(prev  => ({
                ...prev,
                hotel_id: hotel_id,
                trip_id: trip_id,
                is_special: is_special,
                adult_qty: adult_qty,
                child_qty: child_qty,
                children_age: children_age,
            }));
        }
        
        $( "#adult_qty a.dropdown-item" ).on( "click", function() {
            $('#adult_qty button').text($(this).text()+" adults");
            $('#adult_qty button').attr('adult-qty', $(this).attr('adult-qty'));
        });

        $( "#child_qty a.dropdown-item" ).on( "click", function(e) {
        
            var adult_qty = $('#adult_qty button').attr('adult-qty');
            var child_qty = $(this).attr('child-qty');
            
            if(adult_qty < child_qty){  //Error following: Autofocus processing was blocked because a document already has a focused element.
                // UIkit.modal("#modal-sections").hide().then(function(){        
                //     setTimeout(function(){
                //         UIkit.modal.alert('The number of children is greater than allowed. If you are traveling with many children, please call us to make a reservation. Tel: +976 8002-5000, +976 8003-5000').then(function(){
                //             UIkit.modal("#modal-sections").show();
                //         });
                //     }, 1000);                    
                // });
        
                $("#modal-sections ul#children_age_list li").remove();
                $("#modal-sections ul#children_age_list").append($('<li style="color: red;">The number of children is greater than allowed. If you are traveling with many children, please call us to make a reservation. Tel: +976 8002-5000, +976 8003-5000</li>' ));
        
            }else{
                $('#child_qty button').text($(this).text()+" children");
                $('#child_qty button').attr('child-qty', child_qty);
            
                if(child_qty === 0){
                    $("#modal-sections ul#children_age_list li").remove();
                }else{
                    $("#modal-sections ul#children_age_list li").remove();
                    for(var i=0; i < child_qty; i++){
                        $("#modal-sections ul#children_age_list").append($(
                            '<li><div class="col-12" style="height:40px; margin-bottom: 10px;">'
                                    +'<div class="col-6" style="float:left; height: 100%; padding-top: 5px;">Children '+(i+1)+'</div>'
                                        +'<div id="dataTable_filter" class="dataTables_filter">'
                                        +'<div class="btn-group hotel-create-dropdown" id="child_age">'
                                            +'<button val="-1" child-group="'+(i)+'" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Age</button>'
                                            +'<div class="dropdown-menu">'
                                            +'<a class="dropdown-item" href="#" child-age="0">0</a>'
                                            +'<a class="dropdown-item" href="#" child-age="1">1</a>'
                                            +'<a class="dropdown-item" href="#" child-age="2">2</a>'
                                            +'<a class="dropdown-item" href="#" child-age="3">3</a>'
                                            +'<a class="dropdown-item" href="#" child-age="4">4</a>'
                                            +'<a class="dropdown-item" href="#" child-age="5">5</a>'
                                            +'<a class="dropdown-item" href="#" child-age="6">6</a>'
                                            +'<a class="dropdown-item" href="#" child-age="7">Above 7</a>'
                                            +'</div></div></div></div></li>'
                            ));
                    }
        
                    $("#children_age_list li a.dropdown-item").on( "click", function() {
                        $(this).parent().siblings("button").text($(this).text()+" year old");
                        $(this).parent().siblings("button").attr('child-age', $(this).attr('child-age'));
                    });
                }
            }
            
        });
    }

    render(){

        return (
            <>
                { this.state.serviceItems && 
                    this.state.serviceItems.map( (item, index) =>
                    <span key={index}>
                        <PhotoSlider photoItems={ this.state.photoItems }/>
                                
                        <div className="hotel-detail-info jumbotron col-12 col-md-12" style={{ paddingBottom: "0px !important"}}>
                                <div className="jumbotron-title" style={(item.hotel_name.length > 20) ? { float: 'none'} : null} > 
                                    <p style={{ margin:"0" }}>{ item.hotel_name }</p>
                                </div>
                            <div className="rating">
                                { this.runHotelRating(item) }
                            </div>
                            
                        </div>
                                
                        <div className="hotel-detail-info jumbotron col-12 col-md-12">
                            <div className="info-service">
                                <p className="info-title">Services included in the Trip Package :</p>
                                <ul className="info-list">
                                    <li key="1">
                                        <i className="fa fa-calendar fa-lg"></i>
                                        <div className="info-list-item">
                                            <p className="info-list-item-title">Trip to { item.city_name } { item.country_name }</p>
                                            <p>
                                                { item.night_count_plus && 
                                                    (+ item.night_count_plus )
                                                }
                                                nights 
                                                ( { item.departure_datetime } - { item.arrival_datetime } )
                                            </p>
                                        </div>
                                    </li>
                                    <li key="2">
                                        <i className="fa fa-plane fa-lg"></i>
                                        <div className="info-list-item">
                                            <p className="info-list-item-title">Flight</p>
                                            <p>{ item.direction }</p>
                                        </div>
                                    </li>
                                    <li key="3">
                                        <i className="fa fa-building-o fa-lg"></i>
                                        <div className="info-list-item">
                                            <p className="info-list-item-title">Hotel</p>
                                            <p>{ item.hotel_name }</p>
                                        </div>
                                    </li>
                                    <li key="4">
                                        <i className="fa fa-cutlery fa-lg"></i>
                                        <div className="info-list-item">
                                            <p className="info-list-item-title">Meal</p>
                                            <p>{ item.meal }</p>
                                        </div>
                                    </li>
                                    <li key="5">
                                        <i className="fa fa-umbrella fa-lg"></i>
                                        <div className="info-list-item">
                                            <p className="info-list-item-title">Travel Insurance</p>
                                            <p>{ item.insurance }</p>
                                        </div>
                                    </li>
                                    <li key="6">
                                        <i className="fa fa-smile-o fa-lg"></i>
                                        <div className="info-list-item">
                                            <p className="info-list-item-title">Airport Pick-up and Drop-off</p>
                                            <p>{ item.welcome_service }</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* // {#<button className="uk-button uk-button-default uk-button-small show_more">Бусад мэдээлэл үзэх</button>#} */}
                    </span>
                    )
                }
    
                { this.state.roomItems &&
                    <>
                        <div className="hotel-detail-info jumbotron col-12 col-md-12">
                            <div className="info-service">
                                <p className="info-title">Rooms and Guests:</p>
                                <ul className="info-list">
                                    { this.state.roomItems.map((item, index) =>
                                        <li key={index}>
                                            <i className="fa fa-bed fa-lg"></i>
                                            <div className="info-list-item">
                                                <table style={{ width:"100%" }}>
                                                    <thead>
                                                        <tr>
                                                            <th>{  item.room_name  }</th>
                                                            <th style={{ textAlign: "right" }}>
                                                                { item.is_special === 1 &&
                                                                    <>
                                                                        <span className="room_discount">
                                                                            { item.price_bb } MNT 
                                                                        </span>
                                                                        { item.price_discounted_bb } MNT
                                                                    </>
                                                                }
                                                                { item.is_special === 0 &&
                                                                    <>{ item.price_bb} MNT</>
                                                                } 
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="table-value">
                                                        <tr>
                                                            <td style={{ fontSize: "14px" }}><span>(TWN BED)</span></td>
                                                            <td style={{ textAlign: "right", fontSize: "14px" }}>
                                                                <span>(2 persons)</span>
                                                                <span style={{ paddingLeft:"5px" }}>{ item.night_count } nights
                                                                    { item.night_count_plus &&
                                                                        <>
                                                                            ( +{ item.night_count_plus } )
                                                                        </>
                                                                    }
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="hotel-detail-info jumbotron col-12 col-md-12">
                            <div>
                                <a id="choose_room" className="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom" style={{ color: "#fff" }}>BOOK</a>		
                            </div>
                        </div>
                    </>
                }
                  
            </>
        )
    }

}

export default Hotel