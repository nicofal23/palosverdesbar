// Footer.jsx
import React from 'react';
import style from './Footer.module.css';

const Footer = () => {
  return (
    <div className={style.footer}>
      <p>© 2024 Mi Website \\ </p> <a href="https://www.nicolasdev.com.ar" className={style.a}>Falciglio Nicolas</a> 
    </div>
  );
};

export default Footer;
