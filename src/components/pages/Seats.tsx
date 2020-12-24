import React from "react";
// @ts-ignore
import {Link} from "react-router-dom";
import axios from "axios";
// @ts-ignore
import $ from 'jquery'
import {withSnackbar} from 'notistack';

class Seats extends React.Component {
    // @ts-ignore
    constructor(props) {
        super(props);
        this.state = {
            bus: {
                "id": "",
                "name": "",
                "route": {
                    "startingPoint": "",
                    "endPoint": ""
                },
                "seats": null,
                "departureTime": "0",
                "arrivalTime": "",
                "price": null
            },
            seats: [],
            selectedSeat: null,
            prevSelectedSeat: null,
            subTotal: 0,
            serviceCharge: 0
        }
        ;
    }

    // @ts-ignore
    handleError(msg) {
        // @ts-ignore
        this.key = this.props.enqueueSnackbar(msg, {
            variant: 'error',
            autoHideDuration: 3000,
        });
    }

    // @ts-ignore
    downNotify(msg) {
        // @ts-ignore
        this.key = this.props.enqueueSnackbar(msg, {
            variant: 'info',
            autoHideDuration: 6000,
        });
    }

    async componentDidMount() {
        // @ts-ignore
        const trip = await axios.get(`http://localhost:3003/trips/${this.props.match.params.tripId}`);
        this.setState({seats: trip.data.seats}, async () => {
            // @ts-ignore
            console.log(this.state.seats)
            const bus = await axios.get(`http://localhost:3003/buses/${trip.data.busId}`);
            this.setState({bus: bus.data}, () => {
                // @ts-ignore
                console.log(this.state.bus)
            })
        })
    }

    displaySeatInfo = () => {
        const row = $("<tr></tr>");
        // @ts-ignore
        const col1 = $("<td>"+ this.state.selectedSeat +"</td>");
        const col2 = $("<td>E-CLASS</td>");
        // @ts-ignore
        const col3 = $("<td>"+ this.state.bus.price +"</td>");
        $('#seat-info-table tbody tr:first').remove();
        row.append(col1,col2,col3).prependTo("#seat-info-table");
        // @ts-ignore
        this.setState({subTotal: this.state.bus.price, serviceCharge: 40})
    }

    // @ts-ignore
    processSelectedSeat = async (id, status) => {
        if (status === 'available') {
            console.log("Hi", id)
            // @ts-ignore
            // await axios.put(`http://localhost:3003/trips/${this.props.match.params.tripId}?`, user);
            // @ts-ignore
            this.setState({prevSelectedSeat: this.state.selectedSeat}, () => {
                this.setState({selectedSeat: id}, async () => {
                    $('#' + id).css('color', '#6aff00')
                    // @ts-ignore
                    if (this.state.prevSelectedSeat && this.state.prevSelectedSeat !== this.state.selectedSeat) {
                        // @ts-ignore
                        $('#' + this.state.prevSelectedSeat).css('color', '#000000')
                    }
                    // @ts-ignore
                    this.displaySeatInfo()
                })
            })
        } else if (status === 'selected') {
            console.log('selected')
            this.setState({selectedSeat: null})
        } else {
            console.log("Not hi", id)
        }
    }

    proceedToPurchase = () => {
        this.handleError("Something went wrong!")
        this.downNotify("Purchase is unavailable for right now. Try later.")
    }

    render() {
        // @ts-ignore
        const {bus, seats, subTotal, serviceCharge, selectedSeat} = this.state
        return (
            <div className="container">
                <div className="mt-5">
                    <div className="row border-bottom text-center" key={bus.id}>
                        <div className="col-sm border-right">
                            <h6>{bus.name}</h6>
                            <p className="text-muted">{bus.id}</p>
                            <p className="text-muted">Starting Point: <span
                                className="text-primary">{bus.route.startingPoint}</span></p>
                            <p className="text-muted">End Point: <span
                                className="text-primary">{bus.route.endPoint}</span></p>
                        </div>
                        <div className="col-sm border-right">
                            <h6 className="lead">DEPARTURE TIME</h6>
                            <p className="text-primary">{bus.departureTime}</p>
                        </div>
                        <div className="col-sm border-right">
                            <h6 className="lead">ARRIVAL TIME</h6>
                            <p className="text-primary">{bus.arrivalTime}</p>
                        </div>
                        <div className="col-sm">
                            <h6 className="text-primary display-4">&#2547;{bus.price}</h6>
                        </div>
                    </div>
                    <div className="mt-5">
                        <div className="row text-center">
                            <div className="col-sm">
                                <i className="material-icons" style={{color: "#ff00e5"}}>&#xe637;</i>
                                <p className="text-muted">Booked</p>
                            </div>
                            <div className="col-sm">
                                <i className="material-icons" style={{color: "#f30000"}}>&#xe637;</i>
                                <p className="text-muted">Blocked</p>
                            </div>
                            <div className="col-sm">
                                <i className="material-icons" style={{color: "#000000"}}>&#xe637;</i>
                                <p className="text-muted">Available</p>
                            </div>
                            <div className="col-sm">
                                <i className="material-icons" style={{color: "#6aff00"}}>&#xe637;</i>
                                <p className="text-muted">Selected</p>
                            </div>
                            <div className="col-sm">
                                <i className="material-icons" style={{color: "#de4e15"}}>&#xe637;</i>
                                <p className="text-muted">Sold</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <div className="row text-center">
                            <div className="col-6 border-right">
                                <div className="p-2" style={{border: "2px solid black"}}>
                                    <div className="row">
                                        {
                                            // @ts-ignore
                                            seats.length > 0 && seats.map((seat, index) => {
                                                let color = null;
                                                let cursor = null;
                                                switch (seat.status) {
                                                    case "booked":
                                                        color = "#ff00e5"
                                                        cursor = 'not-allowed'
                                                        break;
                                                    case "blocked":
                                                        color = "#f30000"
                                                        cursor = 'not-allowed'
                                                        break;
                                                    case "sold":
                                                        color = "#de4e15"
                                                        cursor = 'not-allowed'
                                                        break;
                                                    case "selected":
                                                        color = "#6aff00"
                                                        cursor = 'pointer'
                                                        break;
                                                    default:
                                                        color = "#000000"
                                                        cursor = 'pointer'
                                                }
                                                return (
                                                    <>
                                                        <div className="col-3">
                                                            <i className="material-icons"
                                                               style={{color: color, cursor: cursor}}
                                                               onClick={() => this.processSelectedSeat(seat.id, seat.status)}
                                                               id={seat.id}>&#xe637;</i>
                                                        </div>
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <h6 className="lead">Seat Information</h6>
                                <table className="table" id="seat-info-table">
                                    <thead>
                                    <tr>
                                        <th scope="col">SEAT</th>
                                        <th scope="col">CLASS</th>
                                        <th scope="col">FARE</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>_</td>
                                        <td>_</td>
                                        <td>_</td>
                                    </tr>
                                    <tr>
                                        <td>Sub Total:</td>
                                        <td>&emsp;</td>
                                        <td>{subTotal} &#2547;</td>
                                    </tr>
                                    <tr>
                                        <td>Service Charge:</td>
                                        <td>&emsp;</td>
                                        <td>{serviceCharge} &#2547;</td>
                                    </tr>
                                    <tr>
                                        <td>Grand Total:</td>
                                        <td>&emsp;</td>
                                        <td>{subTotal + serviceCharge} &#2547;</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div className={selectedSeat ? "text-center d-block" : "d-none"}>
                                    <hr className="border-dark"/>
                                    <button type="button" className="btn btn-outline-primary" onClick={this.proceedToPurchase}>Process to purchase</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

};

// @ts-ignore
export default withSnackbar(Seats)
