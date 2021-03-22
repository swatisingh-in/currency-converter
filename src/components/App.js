import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { EXCHANGE_RATE_BASE_URL } from './constants';
import GlobalStyles from './styles/GlobalStyles';
import { generateRandomId, getRandomColor } from './utils';
import CurrencyConverter from './CurrencyConverter';
import CurrencyChart from './CurrencyChart';
import CURRENCY_NAMES from './currencyNames';
import BaseContainer from './styles/BaseContainer';
import GraphContainer from './styles/GraphContainer';
import ConversionContainer from './styles/ConversionContainer';
import ConversionRowWrapper from './styles/ConversionRowWrapper';
import ConversionRow from './styles/ConversionRow';
import Button from './styles/Button';
import Header from './styles/Header';
import AddIcon from '../images/add-icon.svg';
import RemoveIcon from '../images/remove-icon.svg';
import Logo from '../images/currency-icon.svg';

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

  useEffect(async () => {
    if (currencies.length > 0) {
      const newConversionData = [...conversionData];
      newConversionData[0].fromCurrency = currencies[0].value;
      newConversionData[0].toCurrency = currencies[1].value;
      updateConversionData(newConversionData);
    }
  }, [currencies]);

  const handleAddConversionRow = () => {
    const newConversionData = conversionData.concat(
      [{
        id: generateRandomId(),
        fromCurrency: currencies[0].value,
        toCurrency: currencies[1].value,
        chartBackgroundColor: getRandomColor(),
        chartBorderColor: getRandomColor(),
        chartData: {},
      }],
    );
    updateConversionData(newConversionData);
  };

  const handleRemoveConversionRow = (id) => {
    const newConversionData = conversionData.filter((item) => item.id !== id);
    updateConversionData(newConversionData);
  };

  const updateFromCurrency = (id, fromCurrency) => {
    const newConversionData = conversionData.map((item) => {
      if (item.id !== id) {
        return item;
      }
      return { ...item, fromCurrency };
    });

    updateConversionData(newConversionData);
  };

  const updateToCurrency = (id, toCurrency) => {
    const newConversionData = conversionData.map((item) => {
      if (item.id !== id) {
        return item;
      }
      return { ...item, toCurrency };
    });

    updateConversionData(newConversionData);
  };

  const updateChartData = (id, chartData) => {
    const newConversionData = conversionData.map((item) => {
      if (item.id !== id) {
        return item;
      }
      return { ...item, chartData };
    });

    updateConversionData(newConversionData);
  };

  return (
    <>
      <GlobalStyles />
      <BaseContainer>
        <ConversionContainer>
          <Header>
            <img alt="logo" src={Logo} />
            Currency Converter
          </Header>
          <ConversionRowWrapper>
            {
              conversionData.map((item, index) => (
                <ConversionRow key={item.id}>
                  <CurrencyConverter
                    currencies={currencies}
                    data={item}
                    updateFromCurrency={updateFromCurrency}
                    updateToCurrency={updateToCurrency}
                    showRemoveButton={conversionData.length > 1}
                    updateChartData={updateChartData}
                  />
                  {
                    index === conversionData.length - 1 ? (
                      <Button
                        icon={AddIcon}
                        type="button"
                        onClick={handleAddConversionRow}
                        aria-label="Add conversion"
                      />
                    ) : (
                      <Button
                        icon={RemoveIcon}
                        type="button"
                        onClick={() => handleRemoveConversionRow(item.id)}
                        aria-label="Remove conversion"
                      />
                    )
                  }
                </ConversionRow>
              ))
            }
          </ConversionRowWrapper>
        </ConversionContainer>
        <GraphContainer>
          <CurrencyChart conversionData={conversionData} />
        </GraphContainer>
      </BaseContainer>
    </>
  );
}

export default App;
