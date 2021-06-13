
/**
 * @description This func is used to build available airlanes based flights json data
 * on filtering based on ArrivalAirport and Departure Airport airlane on join with the airlanes key
 * @param compnentInstance This prop holds the search Flights component instance
 */
export function getAvailableAirlanes(compnentInstance: any): any {

  // validation the flightsJSON DATA
  if (compnentInstance.flightsJSON.data) {

    let airplanesLKP: any = [];

    // looping through the each flight and build available airlanes based on
    // arrival and departure airport
    compnentInstance.flightsJSON.data.forEach((eachFlightInfo: any) => {

      // chking the is current iterated fligh airlane is added to airlanes list or not
      // if not the resp airlane location to locations list
      if (!airplanesLKP.includes(eachFlightInfo.arrivalAirport) && eachFlightInfo.arrivalAirport in compnentInstance.flightsJSON.included) {
        airplanesLKP.push(eachFlightInfo.arrivalAirport);
        addLocationToAvailLocationsList(eachFlightInfo.arrivalAirport)
      }

      // chking the is current iterated fligh departure is added to airlanes list or not
      // if not the resp departure location to locations list
      if (!airplanesLKP.includes(eachFlightInfo.departureAirport) && eachFlightInfo.departureAirport in compnentInstance.flightsJSON.included) {
        airplanesLKP.push(eachFlightInfo.departureAirport);
        addLocationToAvailLocationsList(eachFlightInfo.departureAirport)
      }
    });
  }

  /**
   * @description This func is to add location object to the componet state varibale
   * @param {string} key Hodl the key name to read from flightsJSON object
   */
   function addLocationToAvailLocationsList(key: string) {
    compnentInstance.state.availableArrivalAndDepartLocations.push({
      value: key,
      label: `${compnentInstance.flightsJSON.included[key].city} (${compnentInstance.flightsJSON.included[key].name})`
    })
  };
}

/**
 * @description  This func is used to filter flights based on from location and to location
 * and bind respective data to grid 
 * @param compnentInstance {any}  holds the search flights component instance
 * @param NotificationManager {NotificationManager} which is module used to show alerts   
 * @returns {void}
 */
export function filterFlights(compnentInstance: any, NotificationManager:any): void{
  if (!compnentInstance.state.selectedFromLocation)
    return showInfoMsg('Please Select From Location', compnentInstance);  

  if (!compnentInstance.state.selectedToLocation)
    return showInfoMsg('Please Select To Location', compnentInstance);  

  if (compnentInstance.state.selectedFromLocation.value == compnentInstance.state.selectedToLocation.value)
    return showInfoMsg('From Location and To Location must be Different', compnentInstance);  

  if(!compnentInstance.state.departureDate)
      return showInfoMsg('Please Select Departure Date', compnentInstance);  

  if(compnentInstance.flightsJSON.data)
  {
    compnentInstance.gridParams.api.setRowData(compnentInstance.flightsJSON.data.filter((eachFlight: any) => {
      if(eachFlight.departureAirport === compnentInstance.state.selectedFromLocation.value
          && eachFlight.arrivalAirport === compnentInstance.state.selectedToLocation.value){
            eachFlight.flightAirLinesName = compnentInstance.flightsJSON.included[eachFlight.airline].name || "";
            return eachFlight;
          }
    }));
  }

  function showInfoMsg(msg:string, compnentInstance:any){
    NotificationManager.info('', msg, 3000, () => { });
    compnentInstance.gridParams.api.setRowData([]);
  }
} 

/**
 * @description THis func just returening the search flights grid columns
 * @returns {Array} holds the searhc flights grid columns
 */
export function getSearchFlightsGridColumns(): any{
  
 return [
    { headerName:"Flight #.", field:"flightNumber"},
    { headerName:"Flight Name", field:"flightAirLinesName"},
    { headerName:"Departure Time", field:"takeoff"},
    { headerName:"Arrival Time", field:"landing"},
    { headerName:"Flight Duration", field:"duration"},
    { headerName:"Ticket Price", field:"price", width:'50px'},
  ];
  // .reduce((intial:any, current)=>{
  //   return`${intial}<AgGridColumn headerName="${current.headerName}"
  //       field="${current.field}"></AgGridColumn>`
  // }, '')

}