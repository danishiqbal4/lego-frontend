// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LegoSet from './components/LegoSet';
import ViewCustomSet from './components/ViewCustomSet';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LegoSet />} />
                <Route path="/view/set/:setId" element={<ViewCustomSet />} />
            </Routes>
        </Router>
    );
}

export default App;
