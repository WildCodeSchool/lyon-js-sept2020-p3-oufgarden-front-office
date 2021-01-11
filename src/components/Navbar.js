import React from 'react';
import './style/Navbar.scss';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import history from '../history';

const Navbar = () => {
  if (history.location.pathname === '/') {
    return false;
  }
  return (
    <div className="menu">
      <ul>
        <Link to="/articles">
          <div className="articles" />
        </Link>
        <Link to="/calendar">
          <div className="calendar" />
        </Link>
        <Link to="/garden">
          <div className="jardin" />
        </Link>
        <Link to="/user">
          <div className="user" />
        </Link>
      </ul>
    </div>
  );
};

export default withRouter(Navbar);
