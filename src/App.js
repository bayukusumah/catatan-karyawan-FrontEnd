import React,{useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './page/HomePage';
import EmployeePage from './page/EmployeePage';
import KinerjaPage from './page/KinerjaPage';
import KarirPage from './page/KarirPage';


function App() {
    const [menuHidden, setMenuHidden] = useState(false);
  return (
    <Router>
        <div className="app-container d-flex">

            <div className={`sidebar bg-orange ${menuHidden ? 'hidden' : ''}`}>
                <button className="btn btn-primarys toggle-button"
                        onClick={() => setMenuHidden(!menuHidden)}>
                        {menuHidden ? '>>' : '<<'}
                </button>
                <nav className="nav" >
                    <ul className="nav flex-column mt-5">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Dasboard</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/employee">Employee</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/kinerja">Kinerja</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/karir">Karir</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className={`content flex-grow-1 p-3 ${menuHidden ? 'content-expanded' : ''}`}>
                    <h1 className="text-center mb-4">Catatan Karyawan</h1>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/employee" element={<EmployeePage />} />
                        <Route path="/kinerja" element={<KinerjaPage />} />
                        <Route path="/karir" element={<KarirPage />} />
                    </Routes>
            </div>
        </div>
    </Router>
  );
}

export default App;

