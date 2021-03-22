import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2/dist/react-chartjs-2';
import ChartHeader from './styles/ChartHeader';

const CurrencyChart = (props) => {
  const { conversionData } = props;

  let labels = null;
  let datasets = [];

  if (conversionData.length > 0) {
    labels = Object.keys(conversionData[0].chartData).sort();
    datasets = conversionData.map((item) => {
      const dataset = {};
      dataset.label = `${item.fromCurrency} to ${item.toCurrency}`;
      if (Object.keys(item.chartData).length !== 0) {
        dataset.data = labels.map(
          (date) => item.chartData[date][item.toCurrency],
        );
      }
      dataset.fill = false;
      dataset.backgroundColor = item.chartBackgroundColor;
      dataset.borderColor = item.chartBorderColor;
      return dataset;
    });
  }

  const data = {
    labels,
    datasets,
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
    <>
      <ChartHeader>
        <h3>Currency Chart</h3>
        <h3>1 Month</h3>
      </ChartHeader>
      <Line data={data} options={options} />
    </>
  );
};

CurrencyChart.propTypes = {
  conversionData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    fromCurrency: PropTypes.string.isRequired,
    toCurrency: PropTypes.string.isRequired,
    chartData: PropTypes.shape({}).isRequired,
  })).isRequired,
};

export default CurrencyChart;
