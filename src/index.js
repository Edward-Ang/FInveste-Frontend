import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import statement
import Main from './Main'; // Import the new routing component
import './index.css';

// Use createRoot to render your application
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<Main />);
