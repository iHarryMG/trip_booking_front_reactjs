import React from 'react'

const CarInfoModal = ({resultItems}) => {
    return (
        <div className="uk-modal-dialog">
            <button className="uk-modal-close-default" type="button" data-uk-close=""></button>
            <div className="uk-modal-header">
                <h3 className="uk-modal-title">Rent car booking</h3>
            </div>
            <div className="uk-modal-body">
                <p style={{margin:"0"}}>
                    Would you like to rent a car to travel to { resultItems.car_info[0].car_direction }? 
                </p>
                <div className="uk-overflow-auto">
                    <table className="uk-table uk-table-hover uk-table-middle uk-table-divider">
                        <thead>
                            <tr>
                                <th className="uk-table-shrink"></th>
                                <th className="uk-table-shrink uk-text-nowrap">Direction</th>
                                <th className="uk-table-shrink uk-text-nowrap">Adults</th>
                                <th className="uk-table-expand uk-text-nowrap">Children*</th>
                            </tr>
                        </thead>
                        <tbody>
                            { resultItems.car_info.map( (item, index) =>
                                <tr key={index}>
                                    <td><input style={{width:"20px", height:"20px"}} className="uk-radio"  type="radio" name="car_id" value={ item.car_price_id } /></td>
                                    <td className="uk-text-nowrap">{ item.way } way</td>
                                    <td className="uk-text-nowrap">{ item.adult_price } MNT</td>
                                    <td className="uk-text-nowrap">{ item.child_price } MNT</td>
                                </tr>
                            )}
                                <tr>
                                    <td colSpan="4">*Children (2-7 years old)</td>
                                </tr>
                                <tr>
                                    <td colSpan="4">The car booking fee will be added to your travel fee.</td>
                                </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="uk-modal-footer uk-text-right">
                <button id='car_order_no' className="uk-button uk-modal-close" type="button">No, thanks</button>
                <button id='car_order_yes' className="uk-button uk-button-primary" type="button">Yes, sure</button>
            </div>
        </div>
    )
}

export default CarInfoModal