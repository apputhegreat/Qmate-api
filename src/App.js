import React, { Component } from 'react';

import './App.css';
import AppHeader from './components/AppHeader';
import 'antd/dist/antd.css';
import Main from './components/Main';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <AppHeader />
        </div>
        <Main />
      </div>
    );
  }
}

export default App;
