import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import SwapIcon from '../images/swap-icon.svg';
import { EXCHANGE_RATE_BASE_URL, EXCHANGE_RATE_HISTORY_URL } from './constants';
import ConversionColumn from './styles/ConversionColumn';
import Label from './styles/Label';
import Input from './styles/Input';
import InputWrapper from './styles/InputWrapper';
import Select from './styles/Select';
import Button from './styles/Button';

const CurrencyConverter = (props) => {
  const {
    currencies,
    data,
    updateFromCurrency,
    updateToCurrency,
    updateChartData,
    handleSwapCurrencies,
  } = props;

  const { fromCurrency, toCurrency } = data;
  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState();
  const [userInputIsFromCurrency, setUserInputIsFromCurrency] = useState(true);

  const todaysDate = new Date();
  const endDate = todaysDate.toISOString().split('T')[0];
  todaysDate.setMonth(todaysDate.getMonth() - 1);
  const startDate = todaysDate.toISOString().split('T')[0];

  // Fetch exchange rate and historical data for selected currencies.
  useEffect(async () => {
    if (fromCurrency && toCurrency) {
      const response = await axios.get(`${EXCHANGE_RATE_BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`);
      if (response && response.data && typeof response.data.rates === 'object' && response.data.rates != null) {
        setExchangeRate(response.data.rates[toCurrency]);
      }

      const chartResponse = await axios.get(`${EXCHANGE_RATE_HISTORY_URL}?start_at=${startDate}&end_at=${endDate}&base=${fromCurrency}&symbols=${toCurrency}`);
      if (chartResponse != null && chartResponse.data.rates != null) {
        updateChartData(data.id, chartResponse.data.rates);
      }
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

  let fromAmount = null;
  let toAmount = null;
  if (userInputIsFromCurrency) {
    fromAmount = amount;
    toAmount = exchangeRate ? (amount * exchangeRate).toFixed(2) : '';
  } else {
    toAmount = amount;
    fromAmount = exchangeRate ? (amount / exchangeRate).toFixed(2) : '';
  }

  return (
    <>
      <ConversionColumn>
        <Label htmlFor="fromCurrency">
          Amount
        </Label>
        <InputWrapper>
          <Input
            autoFocus
            id="fromCurrency"
            type="number"
            value={fromAmount}
            onChange={handleChangeInFromAmount}
          />
          <Select
            options={currencies}
            value={currencies.filter((currency) => currency.value === fromCurrency)}
            onChange={(event) => updateFromCurrency(data.id, event.value)}
          />
        </InputWrapper>
      </ConversionColumn>
      <Button
        icon={SwapIcon}
        type="button"
        aria-label="Swap currencies"
        title="Swap currencies"
        onClick={() => handleSwapCurrencies(data.id)}
      />
      <ConversionColumn>
        <Label htmlFor="toCurrency">
          To
        </Label>
        <InputWrapper marginLeft>
          <Input
            id="toCurrency"
            type="number"
            value={toAmount}
            onChange={handleChangeInToAmount}
          />
          <Select
            options={currencies}
            value={currencies.filter((currency) => currency.value === toCurrency)}
            onChange={(event) => updateToCurrency(data.id, event.value)}
          />
        </InputWrapper>
      </ConversionColumn>
    </>
  );
};

CurrencyConverter.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fromCurrency: PropTypes.string.isRequired,
    toCurrency: PropTypes.string.isRequired,
  }).isRequired,
  updateFromCurrency: PropTypes.func.isRequired,
  updateToCurrency: PropTypes.func.isRequired,
  updateChartData: PropTypes.func.isRequired,
  handleSwapCurrencies: PropTypes.func.isRequired,
};

export default CurrencyConverter;
