import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ListQuotes from './ListQuotes';
import EditQuote from './EditQuote';

const Main = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={ListQuotes} />
      <Route path='/editquote/:quoteId' component={EditQuote} />
    </Switch>
  </BrowserRouter>
)

export default Main;
