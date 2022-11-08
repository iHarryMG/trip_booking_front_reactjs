import React, { useContext } from 'react';
import * as ReactDOM from 'react-dom/client';
import CarInfoModal from './CarInfoModal';
import { handleCustomUKModal } from '../main/App';
import { NavContext } from '../main/Context';

class RoomList extends React.Component {

    constructor(props){
        super(props)
    }

    state = {
        resultItems: []
    }

    componentDidMount() {

        const fetchRoomList = async () => {
            try{
                const data = { trip_id: this.props.trip_id, hotel_id: this.props.hotel_id, 
                is_special: this.props.is_special, adult_count: this.props.adult_count, 
                children_count: this.props.children_count, children_age: this.props.children_age }
                
                const postOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data) 
                }
                
                const result = await fetch('/room/list', postOptions);
                const jsonResult = await result.json();    
                this.setState({ resultItems : jsonResult })

                localStorage.setItem("resultData", JSON.stringify(jsonResult));

                if(jsonResult.car_info){
                    handleCarInfoModal(jsonResult);
                }
                
            }catch(err){
                console.log(err);
            }
        }
            
        fetchRoomList();

        const handleCarInfoModal = (jsonResult) => {
            const modal = ReactDOM.createRoot(document.getElementById('carinfo-modal-sections'));
            modal.render(
                <CarInfoModal resultItems={jsonResult} />
            );
        }

    }

    isValidTime(){
        var d = new Date();
        var hours = parseInt(d.getHours());
        var mins = parseInt(d.getMinutes());
        var day = d.getDay();
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        var dayName = weekday[day];

        console.log("Today is "+dayName);
        console.log("It's "+hours+":"+mins+" o'clock");
        
        let resultDataString = localStorage.getItem("resultData");
        let result = JSON.parse(resultDataString);
        var pass = result.is_skip_user;
        if(pass > 0){
            return true;
        }
        
        if(dayName !== 'Saturday' && dayName !== 'Sunday'){
            if((hours >= 10 && mins >=0) && (hours <= 19 && mins <=59)){
                console.log("Valid weekday and valid hour");
                return true;
            }else{
                console.log("Valid weekday but invalid hour");
                return false;
            }
        }else if(dayName === 'Saturday'){
            if((hours >= 11 && mins >=0) && (hours <= 17 && mins <=59)){
                console.log("Valid weekday and valid hour");
                return true;
            }else{
                console.log("Valid weekday but invalid hour");
                return false;
            }
        }else{
            console.log("Invalid weekday");
            return false;
        }
        
    }
    
    componentDidUpdate() {
        if(this.isValidTime()){
            $("#order_trip_btn").addClass('uk-button-primary');
            $("#order_trip_btn").removeClass('inactive');
        }else{
            $("#order_trip_btn").addClass('inactive');
            $("#order_trip_btn").removeClass('uk-button-primary');
        }
        
        $("#room_qty .dropdown-menu a.dropdown-item").on( "click", function() {
            $(this).parent().siblings("button").text($(this).text()+" room");
            $(this).parent().siblings("button").attr('room-qty', $(this).attr('room-qty'));
            
            if(($(this).text() != undefined || $(this).text() != '') && $(this).text() > 0){
                $("#order_trip_btn").css({
                    'background-color' : '#000066',
                    'color' : '#fff',
                });
                
                getTotalAmount();
                
                $("#price_info").show();
            }else{
                if(getSelectedRooms()['selected_room_qty'] < 1){
                    $('.adult_amount').text('0 MNT');
                    $('.children_amount').text('0 MNT');
                    $('.total_amount').text('0 MNT');
                }
            }
        });
        
        const isValidTime = this.isValidTime;

        $('#order_trip_btn').on('click', function(e){
            e.preventDefault();
            e.target.blur();

            // if(!isValidTime()){
            //     UIkit.modal("#modal-information").show();
            //     return false;
            // }
            
            var min_room = getMinRoom();
            var selected_room_qty = getSelectedRooms()['selected_room_qty'];
            var select_rooms = getSelectedRooms()['select_rooms'];

            if(selected_room_qty < 1){
                handleCustomUKModal("open", "Please select room!");
            }else if(min_room > selected_room_qty){
                handleCustomUKModal("open", "Please select '+(min_room - selected_room_qty)+' more rooms.");
            }else if(min_room < selected_room_qty){
                handleCustomUKModal("open", "The number of rooms you can select from: "+min_room);
            }else{

                // машин захиалга байвал 
                if(isCarInfoAvailable()){
                    UIkit.modal("#carinfo-modal-sections").show();
                    
                    $("#car_order_yes").on('click', function(){
                        if($("input[name='car_id']:checked"). val() === undefined || $("input[name='car_id']:checked"). val() === null){
                            handleCustomUKModal("open", "Please select direction!");
                        }else{
                            submitForm(select_rooms, $("input[name='car_id']:checked"). val());
                        }
                    });    
                    
                    $("#car_order_no").on('click', function(){
                        submitForm(select_rooms, null);
                    });
                }else{
                    submitForm(select_rooms, null);
                }
                
            }
            
        }); 

        const getTotalAmount = () => {
            var select_rooms = getSelectedRooms()['select_rooms'];
            var param = {
                adult_count : this.props.adult_count,
                children_count : this.props.children_count,
                children_age : `${this.props.children_age}`,
                select_rooms : select_rooms,
            };
                    
            sendAjaxRequest('/get/amount', param, function(data, status, xhr){
                if(status === 'success'){
                    $('.adult_amount').text(formatNumber(data['adult_amount'])+' MNT');
                    $('.children_amount').text(formatNumber(data['children_amount'])+' MNT');
                    $('.total_amount').text(formatNumber(data['total_amount'])+' MNT');
                    
                }else{
                    console.log('status: ' + status + ', data: ');
                    console.log(data);
                    handleCustomUKModal("open", 'Internal error during price calculation. Status:'+status+', Data:'+data);
                }
            }, function(jqXhr, textStatus, errorMessage){
                console.log('Error' + errorMessage);
                handleCustomUKModal("open", 'Internal error during price calculation. Error message:'+errorMessage);
            });
        }

        function getSelectedRooms(){
            var selected_room_qty = 0;
            var select_rooms = [];
            var buttons = $("#room_list").find("button");           
            
            for(var i=0; i<buttons.length; i++ ){
                selected_room_qty = selected_room_qty + Number($(buttons[i]).attr('room-qty'));
                if(Number($(buttons[i]).attr('room-qty')) != 0){
                    select_rooms.push({
                        room_id: $(buttons[i]).attr('room-id'),
                        room_qty: $(buttons[i]).attr('room-qty'),
                        room_name: $(buttons[i]).attr('room-name'),
                        room_price_a: $(buttons[i]).attr('room-price'),
                        room_price_bb: $(buttons[i]).attr('room-price-bb'),
                    });
                }
            }
            
            return {
                selected_room_qty : selected_room_qty,
                select_rooms : select_rooms
            };
        }
        
        const submitForm = (select_rooms, car_id) => {
            var param = {
                trip_id : this.props.trip_id ,
                hotel_id : this.props.hotel_id,
                is_special : this.props.is_special,
                adult_count : this.props.adult_count ,
                children_count : this.props.children_count ,
                children_age : `${this.props.children_age}`,
                select_rooms : select_rooms,
                car_id : car_id,
            };

            UIkit.modal("#carinfo-modal-sections").hide();
            handleSetNavID(JSON.stringify(param));
            this.props.navigate(`/photo/${JSON.stringify(param)}`);
        }

        const handleSetNavID = (param) => {
            this.props.setNavIDs(prev  => ({
                ...prev,
                photo_param: param
            }));
        }
        
        function formatNumber(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        }
    
        const getMinRoom = () => {
            let resultDataString = localStorage.getItem("resultData");
            let result = JSON.parse(resultDataString);
            return result.min_room;
        }
        
        const isCarInfoAvailable = () => {
            let resultDataString = localStorage.getItem("resultData");
            let result = JSON.parse(resultDataString);
            if(result.car_info != null) return true;
            else return false;
        }
    }

    selectRoom = (min_room) => {
        const rooms = [];
        for (let i = 0; i <= min_room; i++) {
            let room = <a key={i} className="dropdown-item" href="#" room-qty={i}>{i}</a>;
            rooms.push(room);
        }
        return rooms;
    }


    render(){

        return (
            <>
                <div id="room_list">
                    { this.state.resultItems.rooms &&
                        this.state.resultItems.rooms.map( (item, index) => 
                            <div key={index} className="jumbotron col-12 col-md-12 rooms" style={{ marginTop:"5px", height:"75px"}}>
                                <div id="select-person" className="checkbox checkbox-primary">
                                    <table style={{width:"100%"}} room-num="1" ad-cnt="2" cd-cnt="0">
                                        <tbody>
                                            <tr>
                                                <td rowSpan="2" style={{width:"12%", fontWeight:"bold"}}><i className="fa fa-bed fa-lg"></i></td>
                                                <td style={{width:"40%", fontWeight:"bold"}}>{ item.room_name }</td>
                                                <td style={{width:"44%", textAlign: "right", fontWeight:"bold"}}>
                                                    { item.is_special === 1 ? item.price_discounted_bb+" MNT" : item.price_bb+" MNT" }
                                                </td>
                                            </tr>
                                            <tr className="table-value">
                                                <td style={{textAlign: "left", fontSize: "14px"}}>2 persons (TWN)</td>
                                                <td style={{textAlign: "left", fontSize: "14px", textAlign: "right"}}>
                                                    { item.night_count } nights
                                                    { item.night_count_plus &&
                                                        ( + item.night_count_plus  )
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="btn-group hotel-create-dropdown" id="room_qty">
                                    <button room-id={item.room_id} room-qty="0" room-name={item.room_name} 
                                                room-price={ item.is_special === 1 ? item.price_discounted : item.price_a} 
                                                room-price-bb={ item.is_special === 1 ? item.price_discounted_bb : item.price_bb}
                                            type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                        Select
                                    </button>
                                    <div className="dropdown-menu">
                                        { this.selectRoom(this.state.resultItems.min_room) }
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>

                
                { this.state.resultItems.rooms &&
                    <div id="price_info" className="jumbotron col-12 col-md-12" style={{display:"none"}}>
                        <div>
                            <p className="info-title">Price:</p>
                            <ul className="info-list">
                                <li key="1">
                                    <div className="price-content">
                                        <table style={{width:"100%"}}>
                                            <tbody>
                                                <tr>
                                                    <td><i className="fa fa-user" style={{margin:"0"}}></i></td>
                                                    <td>Adults: {this.props.adult_count}</td>
                                                    <td style={{textAlign: "right"}} className="adult_amount">
                                                        0 MNT
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><i className="fa fa-user" style={{margin:"0"}}></i></td>
                                                    <td>Children: {this.props.children_count} 
                                                        { this.props.children_count != 0 &&
                                                            <span> (Age {this.props.children_age} year old)</span> 
                                                        }
                                                    </td>
                                                    <td style={{textAlign: "right"}} className="children_amount">
                                                        0 MNT
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </li>
                                <li key="2">
                                    <div className="price-total">
                                        <table style={{width:"100%"}}>
                                            <tbody>
                                                <tr>
                                                    <td>Total Price:</td>
                                                    <td style={{textAlign: "right"}} className="total_amount">
                                                        0 MNT
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="order_trip">
                            <button id="order_trip_btn" className="uk-button uk-width-1-1 uk-margin-small-bottom">BOOK</button>	
                        </div>
                    </div>
                }
            </>
        )
    }
}

export default RoomList