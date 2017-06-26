import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ListQuotes from './ListQuotes';
import EditQuote from './EditQuote';
import AddQuotes from './AddQuotes'

const Main = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={AddQuotes} />
      <Route exact path='/quotelist' component={ListQuotes} />
      <Route path='/editquote/:quoteId' component={EditQuote} />
    </Switch>
  </BrowserRouter>
)

export default Main;
