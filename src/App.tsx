import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import TeamList from './client/TeamList';

function App() {
  return (
    <Router>
      <div>  
        <Switch>
          <Route exact path='/' component={TeamList} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
