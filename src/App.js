import React, { Component } from 'react';

import './App.css';
import AppHeader from './components/AppHeader';
import 'antd/dist/antd.css';
import Main from './components/Main';
import * as AuthUtil from './utils/AuthUtil'

class App extends Component {
  componentWillMount() {
    if (!AuthUtil.isAuthenticated()) {
      this.props.history.push('/login');
    }
  }
  render() {
    return (
      <div className="App">
        <div>
          <AppHeader history={this.props.history}/>
        </div>
        <Main />
      </div>
    );
  }
}

export default App;
