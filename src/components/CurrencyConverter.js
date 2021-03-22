import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Line } from 'react-chartjs-2/dist/react-chartjs-2';
import { EXCHANGE_RATE_BASE_URL, CURRENCY_NAMES } from './constants';

function CurrencyConverter() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [amount, setAmount] = useState(100);
  const [exchangeRate, setExchangeRate] = useState();
  const [userInputIsFromCurrency, setUserInputIsFromCurrency] = useState(true);
  const [chartData, setChartData] = useState({});

  // Fetch available currencies from the API endpoint.
  useEffect(async () => {
    const { data } = await axios.get(EXCHANGE_RATE_BASE_URL);

    if (data && data.base && typeof data.rates === 'object' && data.rates != null) {
      setFromCurrency(data.base);
      setToCurrency(Object.keys(data.rates)[0]);
      setCurrencies([{ value: data.base, label: `${data.base} - ${CURRENCY_NAMES[data.base]}` },
        ...(Object.keys(data.rates).map((key) => ({ value: key, label: `${key} - ${CURRENCY_NAMES[key]}` })))]);
    }
  }, []);

  useEffect(async () => {
    if (fromCurrency != null && toCurrency != null) {
      const { data } = await axios.get(`${EXCHANGE_RATE_BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`);
      if (data && typeof data.rates === 'object' && data.rates != null) {
        setExchangeRate(data.rates[toCurrency]);
      }

      const response = await axios.get(`https://api.exchangeratesapi.io/history?start_at=2021-03-10&end_at=2021-03-20&base=${fromCurrency}&symbols=${toCurrency}`);
      setChartData(response.data.rates);
    }
  }, [fromCurrency, toCurrency]);

  const handleChangeInFromAmount = (event) => {
    setAmount(event.target.value);
    setUserInputIsFromCurrency(true);
  };

  const handleChangeInToAmount = (event) => {
    setAmount(event.target.value);
    setUserInputIsFromCurrency(false);
  };

  console.log(chartData);

  const data = {
    labels: Object.keys(chartData).map((key) => key),
    datasets: [
      {
        label: `${fromCurrency} to ${toCurrency} Chart`,
        data: Object.values(chartData).map((value) => value[toCurrency]),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: false,
          },
        },
      ],
    },
  };

  return (
    <div>
      Convert currency
      <label htmlFor="fromCurrency">
        From
        <input
          id="fromCurrency"
          type="number"
          value={userInputIsFromCurrency ? amount : amount / exchangeRate}
          onChange={handleChangeInFromAmount}
        />
      </label>
      <Select
        options={currencies}
        value={currencies.filter((currency) => currency.value === fromCurrency)}
        onChange={(event) => setFromCurrency(event.value)}
      />

      <br />

      <label htmlFor="toCurrency">
        to
        <input
          id="toCurrency"
          type="number"
          value={!userInputIsFromCurrency ? amount : amount * exchangeRate}
          onChange={handleChangeInToAmount}
        />
      </label>
      <Select
        options={currencies}
        value={currencies.filter((currency) => currency.value === toCurrency)}
        onChange={(event) => setToCurrency(event.value)}
      />

      <Line data={data} options={options} />
    </div>
  );
}

export default CurrencyConverter;