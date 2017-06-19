import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ListQuotes from './ListQuotes';
import EditQuote from './EditQuote';

const Main = () => (
  <div>
    <Switch>
      <Route exact path='/' component={ListQuotes} />
      <Route path='/editquote' component={EditQuote} />
    </Switch>
  </div>
)

export default Main;
