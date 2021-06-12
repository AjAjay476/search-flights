import React, {Component} from 'react';
import SearchFlights from './Components/SearchFlights/searchFlights.jsx';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications/lib/notifications.css';

class App extends Component {
  render() {
    return (
      <div className="App App-header">
        <SearchFlights />
      </div>
    );
  }
}
export default App;
