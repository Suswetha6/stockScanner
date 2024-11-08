// ResultsPage.tsx
import React from 'react';
import { StockData } from '@/data';

interface ResultsPageProps {
  data: StockData[];
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ data }) => (
  <div className="p-8">
    <h2 className="text-xl font-semibold mb-4">Filtered Results</h2>
    {data.length > 0 ? (
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Ticker</th>
            <th className="px-4 py-2 border">Market Cap</th>
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
          {data.map((stock, index) => (
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
    ) : (
      <p>No results found based on the filters applied.</p>
    )}
  </div>
);
