import React, { useState, useEffect } from 'react';
import axios from 'axios';
function App() {
  const [currencies, setCurrencies] = useState([]);
  const [conversionData, updateConversionData] = useState(
    [{
      id: generateRandomId(),
      fromCurrency: '',
      toCurrency: '',
      chartBackgroundColor: getRandomColor(),
      chartBorderColor: getRandomColor(),
      chartData: {},
    }],
  );

  // Fetch available currencies from the API endpoint.
  useEffect(async () => {
    const { data } = await axios.get(EXCHANGE_RATE_BASE_URL);

    if (data && data.base && typeof data.rates === 'object' && data.rates != null) {
      setCurrencies([{ value: data.base, label: `${data.base} - ${CURRENCY_NAMES[data.base]}` },
        ...(Object.keys(data.rates).map((key) => ({ value: key, label: `${key} - ${CURRENCY_NAMES[key]}` })))]);
    }
  }, []);

