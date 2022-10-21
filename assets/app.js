/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';
// start the Stimulus application
import './bootstrap';

import App from './main/App';


const site = ReactDOM.createRoot(document.getElementById('site'));
site.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

