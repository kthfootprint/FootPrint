import React from 'react';
import './App.css';
import SearchHeader from './components/searchheader.js';
import GoogleApiWrapper from './components/routemap.js';

const App = () => (
  <div>
  <SearchHeader />
  <GoogleApiWrapper />

	<div id="main"></div>
  </div>
);

export default App;
