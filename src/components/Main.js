import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ListQuotes from './ListQuotes';
import EditQuote from './EditQuote';
import AddQuotes from './AddQuotes';
import ListAuthors from './ListAuthors';
import EditAuthor from './EditAuthor';

const Main = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={AddQuotes} />
      <Route exact path='/quotelist' component={ListQuotes} />
      <Route path='/editquote/:quoteId' component={EditQuote} />
      <Route exact path='/authorslist' component={ListAuthors} />
      <Route path='/editauthor/:authorId' component={EditAuthor} />
    </Switch>
  </BrowserRouter>
)

export default Main;
