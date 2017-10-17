import React from 'react';
import PropTypes from 'prop-types';
import Header from '~/components/header/header';

const Layout = ({ children }) => (
  <div>
    <Header />
    { children }
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
