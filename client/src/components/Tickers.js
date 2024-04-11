import React, { useState, useEffect } from 'react';
import '../index.css';
import { tickers } from './TickerList'

export const Tickers = () => {
  const [tickersData, setTickersData] = useState([]);


  useEffect(() => {

    setTickersData(tickers)

    tickersData.forEach(async (ticker) => {
      try {
        const response = await fetch(`https://api.invertironline.com/api/v2/${ticker.mercado}/Titulos/${ticker.simbolo}/Cotizacion?mercado=${ticker.mercado}&simbolo=${ticker.simbolo}&model.simbolo=${ticker.simbolo}&model.mercado=${ticker.mercado}&model.plazo=${ticker.plazo}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data); // Haz algo con los datos de la respuesta, como guardarlos en el estado o mostrarlos en la interfaz
        } else {
          console.error('Error en la petición:', response.statusText);
        }
      } catch (error) {
        console.error('Error en la petición:', error);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const añadirTicker = e => {
    alert(e.target.simbolo.value)
  }

  return (
    <div className='container2'>
        <h1 className='white'> </h1>
        <h2 className='white'>Agregar ticker</h2>
        <form className='form-tickers' onSubmit={añadirTicker}>
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
          {tickers.map((ticker, index) => (
            <ul key={index} className='tickers'>
              <li>
                MERCADO: <strong>{ticker.mercado} </strong>  
                Símbolo: <strong className='blue'>{ticker.simbolo} </strong>
                Plazo: <strong>{ticker.plazo[0]}; {ticker.plazo[1]} </strong>
                <button className='button3'>Eliminar</button>
              </li>
            
            </ul>
          ))}
          </div>
    </div>
  );

};
