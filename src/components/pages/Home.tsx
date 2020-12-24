import React from 'react';
import axios from "axios";
import Buses from "../layouts/Buses";

class Home extends React.Component {
    // @ts-ignore
    constructor(props) {
        super(props);
        this.state = {
            districts: [],
            data_to_qp: {
                from: '',
                to: '',
                journeyDate: '',
                returnDate: ''
            },
            searchedBuses: [],
            maidenSearch: false,
            seatsAvailability: []
        };
    }

    fetchDistrictList = () => {
        axios.get('http://localhost:3003/districts').then(response => {
            // console.log(response);
            if (response.status === 200) {
                // console.log(response.data)
                const districts = response.data;
                // @ts-ignore
                let districtList = []
                for (const property in districts) {
                    // @ts-ignore
                    districts[property].map(element => {
                        districtList.push(element)
                    })
                }
                // @ts-ignore
                // console.log(districtList)
                this.setState({districts: districtList})
            }
        }).catch(error => {
            if (error.response) {
                console.log(error.response)
            }
        });
    }

    // @ts-ignore
    processBusesSearching(options) {
        this.setState({maidenSearch: true})
        axios.get('http://localhost:3003/buses?route.startingPoint='+options.from+'&'+'route.endPoint='+options.to).then(response => {
            console.log(response);
            if (response.status === 200) {
                // console.log(response.data)
                const buses = response.data
                if (buses.length > 0) {
                    this.fetchTrips(buses, options)
                } else {
                    console.log('search result bus []')
                    // search result []
                    this.setState({searchedBuses: []})
                }
            }
        }).catch(error => {
            if (error.response) {
                console.log(error.response)
            }
        });
    }

    // @ts-ignore
    fetchTrips(buses, options) {
        let reqURL = 'http://localhost:3003/trips?'
        // @ts-ignore
        buses.map((element, index) => {
            if((index + 1) === buses.length) {
                reqURL = reqURL + 'busId='+element.id
            } else {
                reqURL = reqURL + 'busId='+element.id+'&'
            }
        })
        console.log(reqURL)
        reqURL = reqURL +'&journeyDate='+options.journeyDate+'&returnDate='+options.returnDate
        console.log(reqURL)
        axios.get(reqURL).then(response => {
            console.log(response);
            if (response.status === 200) {
                console.log(response.data)
                const trips = response.data
                if (trips.length > 0) {
                    // @ts-ignore
                    let seatsAvailability = []
                    // @ts-ignore
                    trips.map(element => {
                        // @ts-ignore
                        let numOfSeatsAvailable = 0
                        // @ts-ignore
                        element.seats.map(seat => {
                            if (seat.status === "available") {
                                numOfSeatsAvailable = numOfSeatsAvailable + 1
                            }
                        })
                        seatsAvailability.push({
                            busId: element.busId,
                            seatsAvailable: numOfSeatsAvailable,
                            tripId: element.id
                        })
                    })
                    // @ts-ignore
                    this.setState({seatsAvailability}, () => {
                        this.fetchBuses(trips)
                    })
                } else {
                    console.log('search result trips []')
                    // search result []
                    this.setState({searchedBuses: []})
                }
            }
        }).catch(error => {
            if (error.response) {
                console.log(error.response)
            }
        });
    }

    // @ts-ignore
    fetchBuses(trips) {
        let reqURL = 'http://localhost:3003/buses?'
        // @ts-ignore
        trips.map((element, index) => {
            if((index + 1) === trips.length) {
                reqURL = reqURL + 'id='+element.busId
            } else {
                reqURL = reqURL + 'id='+element.busId+'&'
            }
        })
        console.log(reqURL)
        axios.get(reqURL).then(response => {
            console.log(response);
            if (response.status === 200) {
                // console.log(response.data)
                const buses = response.data
                console.log(trips)
                if (buses.length > 0) {
                    this.setState({searchedBuses: buses}, () => {
                        // @ts-ignore
                        console.log(this.state.searchedBuses)
                    })
                } else {
                    this.setState({searchedBuses: []})
                }
            }
        }).catch(error => {
            if (error.response) {
                console.log(error.response)
            }
        });
    }

    componentDidMount() {
        this.fetchDistrictList()
    }

    // @ts-ignore
    inputChangeHandler = (e) => {
        // @ts-ignore
        let obj = this.state.data_to_qp;
        obj[e.target.name] = e.target.value;
        this.setState({data_to_qp: obj}, () => {
            // @ts-ignore
            console.log(this.state.data_to_qp)
        });
    };

    // @ts-ignore
    formSubmitHandler = (e) => {
        e.preventDefault();
        // @ts-ignore
        const {data_to_qp} = this.state
        this.processBusesSearching(data_to_qp)
    };

    render() {
        // @ts-ignore
        const {districts, data_to_qp, searchedBuses, maidenSearch, seatsAvailability} = this.state
        return (
            <div className="container">
                <div className="mt-5 p-5" style={{border: '5px solid #0D78F9'}}>
                    <form onSubmit={this.formSubmitHandler}>
                        <div className="form-row">
                            <div className="col">
                                <label>From</label>
                                <select className="form-control" name="from" required onChange={this.inputChangeHandler} value={data_to_qp.from}>
                                    <option value="">Select one</option>
                                    {
                                        // @ts-ignore
                                        districts.map((district, index) => (
                                            <option value={district} key={index}>
                                                {district}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="col">
                                <label>To</label>
                                <select className="form-control" name="to" required onChange={this.inputChangeHandler} value={data_to_qp.to}>
                                    <option value="">Select one</option>
                                    {
                                        // @ts-ignore
                                        districts.map((district, index) => (
                                            <option value={district} key={index}>
                                                {district}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="col">
                                <label>Journey Date</label>
                                <input type="date" className="form-control" placeholder="Journey date"
                                       name="journeyDate" required onChange={this.inputChangeHandler}/>
                            </div>
                            <div className="col">
                                <label>Return Date <small>(Optional)</small></label>
                                <input type="date" className="form-control" placeholder="Return date"
                                       name="returnDate" onChange={this.inputChangeHandler}/>
                            </div>
                            <div className="col">
                                <button type="submit" className="btn btn-outline-primary" style={{marginTop: '2rem'}}>Search Buses</button>
                            </div>
                        </div>
                    </form>
                </div>
                <Buses
                    // @ts-ignore
                    searchedBuses={searchedBuses} maidenSearch={maidenSearch} options={data_to_qp} secretInfo={seatsAvailability}/>
            </div>
        );
    }
}

export default Home;
