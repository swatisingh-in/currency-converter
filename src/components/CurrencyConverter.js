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

function CurrencyConverter(props) {
  const {
    currencies,
    data,
    updateFromCurrency,
    updateToCurrency,
    updateChartData,
  } = props;

  const { fromCurrency, toCurrency } = data;
  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState();
  const [userInputIsFromCurrency, setUserInputIsFromCurrency] = useState(true);

  useEffect(async () => {
    if (fromCurrency != null && toCurrency != null) {
      const response = await axios.get(`${EXCHANGE_RATE_BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`);
      if (response.data && typeof response.data.rates === 'object' && response.data.rates != null) {
        setExchangeRate(response.data.rates[toCurrency]);
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

  let fromAmount = null;
  let toAmount = null;
  if (userInputIsFromCurrency) {
    fromAmount = amount;
    toAmount = exchangeRate ? amount * exchangeRate : '';
  } else {
    toAmount = amount;
    fromAmount = exchangeRate ? amount / exchangeRate : '';
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
      <Button icon={SwapIcon} type="button" aria-label="Swap currencies" />
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
}

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
};

export default CurrencyConverter;
