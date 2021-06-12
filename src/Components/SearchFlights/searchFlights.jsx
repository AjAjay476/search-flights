import { Component } from 'react';
import { IoIosAirplane } from "react-icons/io";
import { AgGridReact } from 'ag-grid-react';
import { NotificationManager } from 'react-notifications';
import Select from "react-dropdown-select";
import { FcCalendar } from "react-icons/fc";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './searchFlights.css';
import flightsJSON from '../../LookUpData/flights.json';
import CustomNoRowsOverlay from '../Utilities/custom-NoRows-Template.jsx';
import {getAvailableAirlanes, filterFlights, getSearchFlightsGridColumns} from './searchFlightsUtilities.ts';

export default class SearchFlights extends Component {

  /**
   * @description This func invoeked at the time of compoent initalization
   * And handled the component variable intializtion which are used within the component
   * And assign the flights JSON Data to compoent state variable
   * @param {object} props is used to acces the componet options which are passed through component definition
   */
  constructor(props) {
    
    super(props)

    this.state = {
      departureDate: new Date(), // holds the deprature date
      availableArrivalAndDepartLocations: [], // holds the avaialble airlanes locations
      selectedFromLocation: undefined,// holds the selected from location info
      selectedToLocation: undefined, // holds the selected to location info
    }
    this.flightsJSON = flightsJSON   // assignint he flights json data to the component local variable
    this.handleChange = this.handleChange.bind(this);
    
    // binding the search btn function to invoke filteration flights 
    this.filterFlights = ()=>{
      filterFlights(this, NotificationManager)
    }

    // invoking to assign available airlanes list to From and To location Drpdowns
    getAvailableAirlanes(this);
  };

  /**
   * @description Initialize the current date as departure date by default
   * @returns {object} holds the current date as deparature date to initalize the datepicker
   */
  getInitialState() {
    var value = new Date().toISOString();
    return {
      departureDate: value
    }
  }
  handleChange(value) {
    this.setState({departureDate: value});
  }

  /**
   * @description This func is used to handle the Form location dropdwon change event
   * @param {Array} selectedCountry Holds the currently slected from location info
   */
  onFromLocationSelctionChanged = (selectedCountry) => {
    this.state.selectedFromLocation = selectedCountry ? selectedCountry[0] : {};
  }

  /**
   * @description This func is used to handle the To location dropdwon change event
   * @param {Array} selectedCountry Holds the currently slected To location info
   */
  onToLocationSelctionChanged = (selectedCountry) => {
    this.state.selectedToLocation =  selectedCountry ? selectedCountry[0] : {};
  }

  /**
   * @description This func is used to handles on grid row selction event
   * consider as the flight booking events
   * so selected flight info shown as the booking flight information through the alert
   */
  onFlightSelectionChanged = () => {
    var selectedRows = this.gridParams.api.getSelectedRows();
    NotificationManager.success('', `Booked Flight Information : 
                              Flight No - ${selectedRows[0].flightNumber}
                              Ticket Price - ${selectedRows[0].price} /-`, 4000, () => {});
  };

  /**
   * @description Finaly it is componet render evetn to render the search flights template tO DOM
   * @returns {Tmeplate} holds the current search flights view
   */
  render() {
    return (
      <div>
        <div className="serach-Flights-header"><h1 style={{paddingTop: '1rem'}}>Flights Booking</h1></div>
        <div className="card custom-card-body">
          <div className="row">
            <div className="form-group col-md-4">
              <label>From </label>
              <div className="input-group input-group-merge">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <IoIosAirplane />
                  </span>
                </div>
                <div className="form-control p-0">
                  <Select name="fromLocation"
                    options={this.state.availableArrivalAndDepartLocations}
                    labelField="label"
                    valueField="value"
                    onChange={this.onFromLocationSelctionChanged}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-md-4">
              <label>To </label>
              <div className="input-group input-group-merge">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <IoIosAirplane />
                  </span>
                </div>
                <div className="form-control p-0">
                  <Select name="fromLocation"
                    options={this.state.availableArrivalAndDepartLocations}
                    labelField="label"
                    valueField="value"
                    onChange={this.onToLocationSelctionChanged}
                  />
                </div>
              </div>
            </div>

            <div className="form-group col-md-4">
              <label>Departure Date</label>
              <div className="input-group input-group-merge">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FcCalendar />
                  </span>
                </div>
                <div className="custom-datepicker form-control p-0">
                  <DatePicker
                    selected={this.state.departureDate}
                    onChange={this.handleChange}
                    className="form-control p-0"
                    name="startDate"
                    dateFormat="d MMMM, yyyy"
                    readonly
                  />
                </div>
              </div>
            </div>
          </div>
          <button type="button" onClick={this.filterFlights} className="col-md-4 btn btn-primary serach-flights-btn">Search</button>
        </div>
        <div className="card custom-grid">
          <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
              rowSelection={'single'}
              rowData={[]}
              onGridReady={(params) => this.gridParams = params}
              onSelectionChanged={this.onFlightSelectionChanged}
              frameworkComponents={{
                customNoRowsOverlay: CustomNoRowsOverlay,
              }}
              noRowsOverlayComponent={'customNoRowsOverlay'}
              noRowsOverlayComponentParams={{
                noRowsMessageFunc: () => 'No Flights Available...',
              }}
              columnDefs={getSearchFlightsGridColumns()}
            >
            </AgGridReact>
          </div>
        </div>
      </div>
    )
  }
}