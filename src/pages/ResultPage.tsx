import React, { useState } from 'react';
import { StockData } from '@/data';

interface ResultsPageProps {
  data: StockData[];
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ data }) => {
  // State for sorting settings
  const [sortColumn, setSortColumn] = useState<string>('marketCapitalization');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Columns that can be sorted
  const columns = [
    'ticker',
    'marketCapitalization',
    'peRatio',
    'roe',
    'debtToEquity',
    'dividendYield',
    'revenueGrowth',
    'epsGrowth',
    'currentRatio',
    'grossMargin'
  ];

  // Handle column change
  const handleColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortColumn(e.target.value);
  };

  // Handle sort order change
  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc');
  };

  // Sorting function based on selected column and order
  const sortedData = [...data].sort((a, b) => {
    const valueA = a[sortColumn as keyof StockData];
    const valueB = b[sortColumn as keyof StockData];

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortOrder === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    } else if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortOrder === 'asc' 
        ? valueA - valueB 
        : valueB - valueA;
    }
    return 0;
  });

  return (
    <div className="p-8 text-black">
      <h2 className="text-xl font-semibold mb-4">Filtered List</h2>
      
      {/* Sorting Dropdowns */}
      {data.length > 1 && (
        <div className="mb-4 flex justify-end space-x-4">
          <p className="mr-2">Sort by:</p>
          <select
            value={sortColumn}
            onChange={handleColumnChange}
            className="p-2 border border-gray-300 rounded bg-darkPrimary/80 text-white hover:bg-darkPrimary"
          >
            {columns.map((column) => (
              <option key={column} value={column}>
                {column.replace(/([A-Z])/g, ' $1').toUpperCase()}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={handleOrderChange}
            className="p-2 border border-gray-300 rounded bg-darkPrimary/80 text-white hover:bg-darkPrimary"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      )}
      {/* Show the number of rows */}
      <p className="mb-4 text-gray-700">
        {sortedData.length > 0 
          ? `${sortedData.length} row${sortedData.length > 1 ? 's' : ''} found`
          : 'No results'
        }
      </p>

      {/* Table of sorted data */}
      {sortedData.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Ticker</th>
              <th className="px-4 py-2 border">Market Cap(in Cr)</th>
              <th className="px-4 py-2 border">P/E Ratio</th>
              <th className="px-4 py-2 border">ROE</th>
              <th className="px-4 py-2 border">Debt to Equity</th>
              <th className="px-4 py-2 border">Dividend Yield</th>
              <th className="px-4 py-2 border">Revenue Growth</th>
              <th className="px-4 py-2 border">EPS Growth</th>
              <th className="px-4 py-2 border">Current Ratio</th>
              <th className="px-4 py-2 border">Gross Margin</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((stock, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{stock.ticker}</td>
                <td className="px-4 py-2 border">{stock.marketCapitalization}</td>
                <td className="px-4 py-2 border">{stock.peRatio}</td>
                <td className="px-4 py-2 border">{stock.roe}</td>
                <td className="px-4 py-2 border">{stock.debtToEquity}</td>
                <td className="px-4 py-2 border">{stock.dividendYield}</td>
                <td className="px-4 py-2 border">{stock.revenueGrowth}</td>
                <td className="px-4 py-2 border">{stock.epsGrowth}</td>
                <td className="px-4 py-2 border">{stock.currentRatio}</td>
                <td className="px-4 py-2 border">{stock.grossMargin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) 
      : (
        <p>No results found based on the filters applied.</p>
      )}
    </div>
  );
};
