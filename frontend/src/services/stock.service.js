import customFetch from "./axios";

const getStocks = () => {
    return customFetch.get('/stock');
}


const StockService = {
    getStocks
}

export default StockService;