import React, { useState } from 'react';
import Fuse from 'fuse.js';
import { useNavigate } from 'react-router-dom';
import { applyFilters, FilterCondition } from '@/filterStocks';
import { parsedStockData, StockData } from '@/data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QueryPageProps {
  setFilteredData: React.Dispatch<React.SetStateAction<StockData[]>>;
}

const QueryPage: React.FC<QueryPageProps> = ({ setFilteredData }) => {
  // State to track errors, autocomplete options, filters, and the query input
  const [error, setError] = useState<string | null>(null);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: FilterCondition }>({});
  const [query, setQuery] = useState<string>('');
  const navigate = useNavigate();

  // Extract and normalize available field names for query validation
  const availableFields = Object.keys(parsedStockData[0]).map(field => 
    field.toLowerCase().replace(/[^a-z0-9]/gi, '') 
  );

  // Configure Fuse.js for autocomplete suggestions with a similarity threshold

  const fuse = new Fuse(availableFields, {
    threshold: 0.3,
    keys: [],
  });
  
  // Function to parse user query into filter conditions
  const parseQuery = (queryString: string): { filters: { [key: string]: FilterCondition }; error: string | null } => {
    let foundError = false;
    const filters: { [key: string]: FilterCondition } = {};
    const conditions = queryString.trim().split(/\s+AND\s+/i);
    let error: string | null = null;

    for (const condition of conditions) {
      const match = condition.trim().match(/(.+?)\s*(>=|<=|>|<|=)\s*(\d+(\.\d+)?)/);
      if (match) {
        const key = match[1].trim().toLowerCase().replace(/\s+/g, '');
        if (!availableFields.includes(key)) {
          error = `Invalid field: ${key}`;
          foundError = true;
          break;
        }
        const operator = match[2];
        const value = parseFloat(match[3]);
        filters[key] = { operator, value };
      } else {
        error = 'Invalid query format';
        foundError = true;
        break;
      }
    }

    if (foundError) {
      return { filters: {}, error }; // Return empty filters and the error message
    }

    return { filters, error: null }; // Return parsed filters and no error
  };

  // Event handler to update query input, manage error state, and generate autocomplete options
  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setError(null);
    }

    // Generate autocomplete options
    const words = value.split(/\s+/);
    const lastWordIndex = value.lastIndexOf(words[words.length - 1]);
    const isTypingLastWord = e.target.selectionStart >= lastWordIndex;
    if (isTypingLastWord) {
      const lastWord = words[words.length - 1].toLowerCase();
      const fuse = new Fuse(availableFields, {
        threshold: 0.3,
        keys: [],
      });
      const suggestions = fuse.search(lastWord).map((result:any) => result.item).slice(0, 5); // Limit to 5 suggestions
      setAutocompleteOptions(suggestions);
    } else {
      setAutocompleteOptions([]);
    }
  };

  // Event handler to run the query
  const handleRunQuery = () => {
    if (query.trim() === '') {
      setError('Please enter a valid query');
      return;
    }
    
    const { filters: parsedFilters, error: parseError } = parseQuery(query);
    
    if (parseError) {
      setError(parseError); // Set the error state if there is a parsing error
      return;
    }

    setFilters(parsedFilters);
    const result = applyFilters(parsedStockData, parsedFilters);
    setFilteredData(result);
    navigate('/results');
  };

  // Render the query page
  return (
    <div className="flex-col items-center justify-center min-h-screen p-8">
      <Card className="mb-6 flex-1 bg-white text-black p-3 rounded-none">
        <h2 className="text-xl font-semibold mb-4">Stock Screening Tool</h2>
        <p className="text-gray-700">Use the input box below to enter a query. For example, you can filter stocks based on their market capitalization, P/E ratio, and ROE.</p>
      </Card>
      <div className='flex flex-1 gap-4 justify-center flex-wrap'>
        <Card className="w-full sm:w-[300px] lg:w-[400px] p-4 bg-white h-full">
          <h3 className="text-lg text-black font-medium mb-2">Enter your Query:</h3>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
              <p>{error}</p>
            </div>
          )}

          <textarea
            value={query}
            onChange={handleQueryChange}
            placeholder="e.g., Market Capitalization > 100 AND ROE > 15"
            className="mb-4 text-black w-full text-md px-4 py-2 border rounded-md min-h-[120px] resize-y bg-white"
          />

          {autocompleteOptions.length > 0 && (
            <ul className="text-black absolute bg-white shadow-lg rounded-md p-2">
              {autocompleteOptions.map((option) => (
                <li
                  key={option}
                  className="cursor-pointer hover:bg-gray-200 p-2"
                  onClick={() => {
                    setQuery((prevQuery) => {
                      const words = prevQuery.split(/\s+/);
                      words[words.length - 1] = option;
                      return words.join(' ');
                    });
                    setAutocompleteOptions([]);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}

          <Button onClick={handleRunQuery} className="mb-4 bg-primary hover:bg-darkPrimary text-white">
            Run Query
          </Button>
        </Card>
        <Card className="w-full sm:w-[300px] lg:w-[400px] p-4 mb-6 border-outline">
          <h3 className="text-lg font-medium mb-2 text-black">Example Queries:</h3>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Market Capitalization &gt; 200 AND ROE &gt; 15</li>
            <li>PE Ratio &lt; 20 AND Dividend Yield &gt; 1</li>
            <li>EPS Growth &gt; 10 AND DebttoEquity &lt; 0.5</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default QueryPage;