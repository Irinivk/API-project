import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Allthespots from "./components/allthespots";
import SpotShow from "./components/detailsofSpots";
import SpotForm from "./components/createNewSpot";
import ManageSpots from "./components/manageSpots";
import EditSpotForm from "./components/updateSpot";
import IntoToCreateSpot from "./components/createNewSpot/IntoToCreateSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
          <Route exact path='/' component={Allthespots} />
          
          <Route exact path='/spots/:spotId/edit' component={EditSpotForm} />
          <Route exact path='/spots/new' component={SpotForm} />
          <Route exact path='/spots/current' component={ManageSpots} />
          <Route exact path='/spots/:spotId' component={SpotShow} />
          <Route exact path='/new/spot/intro' component={IntoToCreateSpot} />
        </Switch>}
    </>
  );
}

export default App;
