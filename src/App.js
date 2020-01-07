import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MyHeader from "./components/MyHeader";
import "./App.css";
import ColorPickerPage from "./containers/ColorPickerPage";
import AboutPage from "./containers/AboutPage";

function App() {
  return (
    <Router>
      <>
        <MyHeader />
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <AboutPage />
          </Route>
          <Route path="/">
            <ColorPickerPage />
          </Route>
        </Switch>
      </>
    </Router>
  );
}

export default App;
