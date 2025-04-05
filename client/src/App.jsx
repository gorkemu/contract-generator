import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ContractList from './components/ContractList';
import ContractEditor from './components/ContractEditor';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<ContractList />} />
            <Route path="/edit/:id" element={<ContractEditor />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}