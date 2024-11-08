import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applyFilters, FilterCondition } from '@/filterStocks';
import { parsedStockData, StockData } from '@/data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
interface QueryPageProps {
  setFilteredData: React.Dispatch<React.SetStateAction<StockData[]>>;
}

const QueryPage: React.FC<QueryPageProps> = ({ setFilteredData }) => {
  const [filters, setFilters] = useState<{ [key: string]: FilterCondition }>({});
  const [query, setQuery] = useState<string>('');
  const navigate = useNavigate();

  const handleRunQuery = () => {
    const parsedFilters = parseQuery(query);
    setFilters(parsedFilters);
    const result = applyFilters(parsedStockData, parsedFilters);
    setFilteredData(result);
    navigate('/results');
  };

  const parseQuery = (queryString: string): { [key: string]: FilterCondition } => {
    const filters: { [key: string]: FilterCondition } = {};
    const conditions = queryString.split(/\s+AND\s+/i);

    conditions.forEach(condition => {
      const match = condition.match(/(.+?)\s*(>=|<=|>|<|=)\s*(\d+(\.\d+)?)/);
      if (match) {
        const key = match[1].trim().toLowerCase().replace(/\s+/g, '');
        const operator = match[2];
        const value = parseFloat(match[3]);
        filters[key] = { operator, value };
      }
    });
    return filters;
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="flex-col items-center justify-center min-h-screen p-8">
      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Stock Screening Tool</h2>
        <p className="text-gray-700">Use the input box below to enter a query. For example, you can filter stocks based on their market capitalization, P/E ratio, and ROE.</p>
      </Card>
      <div className='flex gap-4 justify-center flex-wrap'>
        <Card className="w-full sm:w-[300px] lg:w-[400px] p-4">
          <h3 className="text-lg font-medium mb-2">Enter your Query:</h3>
          <Input
            value={query}
            onChange={handleQueryChange}
            placeholder="e.g., Market Capitalization > 10000 AND ROE > 15"
            className="mb-4"
          />
          <Button onClick={handleRunQuery} className="mb-4" color="primary">
            Run Query
          </Button>
        </Card>
        <Card className="w-full sm:w-[300px] lg:w-[400px] p-4 mb-6">
          <h3 className="text-lg font-medium mb-2">Example Queries:</h3>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Market Capitalization &gt; 10000 AND ROE &gt; 15</li>
            <li>P/E Ratio &lt; 20 AND Dividend Yield &gt; 5</li>
            <li>EPS Growth &gt; 10 AND Debt-to-Equity Ratio &lt; 0.5</li>
          </ul>
        </Card>

      </div>
    </div>


  );
};

export default QueryPage;
