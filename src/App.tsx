// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { parsedStockData, StockData } from './data';
import QueryPage from './pages/QueryPage';
import { ResultsPage } from './pages/ResultPage';

const App = () => {
  const [filteredData, setFilteredData] = useState<StockData[]>(parsedStockData);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<QueryPage setFilteredData={setFilteredData} />} />
        <Route path="/results" element={<ResultsPage data={filteredData} />} />
      </Routes>
    </Router>
  );
};

export default App;
