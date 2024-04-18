import React, { useState, useEffect } from 'react';
import '../index.css';
import { tickers } from './TickerList'


export const Tickers = () => {
  const [tickersData, setTickersData] = useState([]);


  useEffect(() => {

    setTickersData(tickers)

    tickersData.forEach(async (ticker) => {
      try {
      //   const response = await fetch('http://localhost:3001/auth/ticker', {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ username, password })
      // });
      } catch (error) {
        console.error('Error en la petición:', error);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const anadirTicker = e => {
      e.preventDefault()
      const mercado = e.target.mercado.value;
      const simbolo = e.target.simbolo.value;
      const plazo = e.target.plazo.value;

      const newTicker = { mercado, simbolo, plazo };
      setTickersData([...tickersData, newTicker]);
  }

  const eliminarTicker = (e, index) => {
    e.preventDefault();
    const newTickersData = tickersData.filter((ticker, i) => i !== index);
    setTickersData(newTickersData);
    
  }

  return (
    <div className='container2'>
        <h1 className='white'> </h1>
        <h2 className='white'>Agregar ticker</h2>
        <form className='form-tickers' onSubmit={anadirTicker}>
        <select name='mercado' className='input-small'>
            <option value="BCBA">BCBA</option>
            <option value="NYSE">NYSE</option>
            <option value="NASDAQ">NASDAQ</option>
            <option value="AMEX">AMEX</option>
            <option value="BCS">BCS</option>
            <option value="ROFX">ROFX</option>
          </select>
            <input type="text" name='simbolo' placeholder='Símbolo' className='input-small' />
            <select name='plazo' className='input-small'>
            <option value="t0">t0</option>
            <option value="t2">t2</option>
          </select>
          <button type="submit" className='button2'>Añadir</button>
        </form>
        <h3 className='white'>Tickers: </h3>
          <div className='tickers-container'>
          {tickersData.map((ticker, index) => (
            <ul key={index} className='tickers'>
              <li>
                MERCADO: <strong>{ticker.mercado} </strong>  
                Símbolo: <strong className='blue'>{ticker.simbolo} </strong>
                Plazo: <strong>{ticker.plazo[0]}; {ticker.plazo[1]} </strong>
                <button className='button3' data-index={index} onClick={(e) => eliminarTicker(e, index)}>Eliminar</button>
              </li>
            
            </ul>
          ))}
          </div>
    </div>
  );

};
