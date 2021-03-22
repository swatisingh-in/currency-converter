import React from 'react';
import ReactSelect from 'react-select';
import styled from 'styled-components';

const Select = styled(ReactSelect)`
    width: 50%;
`;

// eslint-disable-next-line react/jsx-props-no-spreading
export default (props) => <Select {...props} />;
