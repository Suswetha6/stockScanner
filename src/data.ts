import stockData from './stocks_data.json';

export interface StockData{
  ticker: string ;
  marketCapitalization: number;
  peRatio: number;
  roe: number;
  debtToEquity: number;
  dividendYield: number;
  revenueGrowth: number;
  epsGrowth: number;
  currentRatio: number;
  grossMargin: number;
}

export const parsedStockData: StockData[]  =stockData.map(((stock:any)=>({
  ticker: stock["Ticker"],
  marketCapitalization: stock["Market Capitalization (B)"],
  peRatio: stock["P/E Ratio"],
  roe: stock.ROE,
  debtToEquity: stock["Debt-to-Equity Ratio"],
  dividendYield: stock["Dividend Yield (%)"],
  revenueGrowth: stock["Revenue Growth (%)"],
  epsGrowth: stock["EPS Growth (%)"],
  currentRatio: stock["Current Ratio"],
  grossMargin: stock["Gross Margin (%)"],})))

