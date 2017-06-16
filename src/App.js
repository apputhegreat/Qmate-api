import React, { Component } from 'react';
import './App.css';
//import AddQuote from './components/AddQuote';
import AppHeader from './components/AppHeader';
import ListQuotes from './components/ListQuotes'
import 'antd/dist/antd.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <AppHeader />
        </div>
        <ListQuotes />
      </div>
    );
  }
}

export default App;
