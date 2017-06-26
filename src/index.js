import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import Login from './components/Login';

ReactDOM.render(
  <LocaleProvider locale={enUS}>
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={App}/>
      </Switch>
    </BrowserRouter>
  </LocaleProvider>,
  document.getElementById('root'));
registerServiceWorker();
