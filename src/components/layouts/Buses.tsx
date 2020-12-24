import React from "react";
// @ts-ignore
import {Link} from "react-router-dom";

class Buses extends React.Component {
    // @ts-ignore
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        // @ts-ignore
        const {searchedBuses, maidenSearch, secretInfo} = this.props
        // console.log(secretInfo)
        return (
            <div className="mt-5">
                {
                    !maidenSearch &&
                    <>
                        <div className="text-center">
                            <h1 className="display-4">You have not searched anything yet!</h1>
                            <h6 className="text-muted">Search buses e.g. <b>From:</b> Nokhali, <b>To:</b> Dhaka & <b>Journey
                                Date:</b> 12/24/2020</h6>
                        </div>
                    </>
                }

                {
                    (searchedBuses.length === 0 && maidenSearch) &&
                    <>
                        <div className="text-center">
                            <h1 className="display-4">No buses found.</h1>
                            <h6 className="text-muted">Search buses with something else...</h6>
                        </div>
                    </>
                }

                {
                    (searchedBuses.length > 0 && maidenSearch) &&
                    <>
                        <h6 className="display-4 text-center">Buses found...</h6>
                        <hr/>
                        {
                            // @ts-ignore
                            searchedBuses.map((bus, index) => {
                                // @ts-ignore
                                const numOfSeatAvailable = secretInfo !== undefined ? secretInfo.find(x => x.busId === bus.id).seatsAvailable : 0;
                                // @ts-ignore
                                const tripId = secretInfo !== undefined ? secretInfo.find(x => x.busId === bus.id).tripId : 0;
                                return (
                                    <>
                                        <div className="row border-bottom text-center" key={index}>
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
                                            <div className="col-sm border-right">
                                                <h6 className="lead">SEATS AVAILABLE</h6>
                                                <p className="text-primary">
                                                    {numOfSeatAvailable}
                                                </p>
                                            </div>
                                            <div className="col-sm border-right">
                                                <h6 className="text-primary display-4">&#2547;{bus.price}</h6>
                                            </div>
                                            <div className="col-sm">
                                                <Link className="btn btn-outline-primary" to={`/seats/${tripId}`}>View
                                                    Seats</Link>
                                            </div>
                                        </div>
                                        <br/>
                                    </>
                                )
                            })
                        }
                    </>
                }
            </div>
        );
    }

}

export default Buses;
