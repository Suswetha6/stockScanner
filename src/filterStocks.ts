import { StockData } from "./data";

export interface FilterCondition {
  operator: string;
  value: number;
}

export const applyFilters = (data: StockData[], filters: { [key: string]: FilterCondition }) => {
  return data.filter((stock) =>
    Object.entries(filters).every(([key, condition]) => {
      const { operator, value } = condition;
      const normalizedKey = key.toLowerCase().replace(/-/g, ''); // Convert to lowercase and remove hyphens
      const stockValue = stock[
        Object.keys(stock).find(k => k.toLowerCase().replace(/-/g, '') === normalizedKey) as keyof StockData
      ]; 

      if (stockValue === undefined) {
        console.log(`Key "${key}" not found in stock data:`, stock);
      }

      if (typeof stockValue === 'number') {
        switch (operator) {
          case '>':
            return stockValue > value;
          case '<':
            return stockValue < value;
          case '=':
            return stockValue === value;
          default:
            return false;
        }
      } else if (typeof stockValue === 'string') {
        switch (operator) {
          case '=':
            return stockValue === value.toString();
          default:
            return false;
        }
      }

      return false;
    })
  );
};
