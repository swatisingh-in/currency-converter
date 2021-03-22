import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;400;700&display=swap');
  body {
    background: #394357;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    margin: 0;
    padding: 0;
  }
`;

export default GlobalStyles;
