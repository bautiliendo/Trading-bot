import React, { useState, useEffect, useContext } from 'react';
import '../index.css';
import { tickers } from './TickerList'
import AuthContext from './AuthContext';


export const Tickers = () => {  
  const bearer = useContext(AuthContext)
  const [tickersData, setTickersData] = useState([]);
  const [accessToken, setAccessToken ] = useState("Aqui no hay nada");

  useEffect(() => {
      setAccessToken(bearer.bearer.access_token);
  }, [bearer]); 

  useEffect(() => {
    console.log(accessToken)  // SOLUCIONAR PROBLEMA DE F5 
}, [accessToken]); 

  useEffect(() => {
    setTickersData(tickers)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  //Boton para añadir nuevos tickers
  const anadirTicker = e => {
      e.preventDefault()
      const mercado = e.target.mercado.value;
      const simbolo = e.target.simbolo.value;
      const plazo = e.target.plazo.value;
      const newTicker = { mercado, simbolo, plazo };
      setTickersData([...tickersData, newTicker]);
  }

  //Boton para eliminar tickers
  const eliminarTicker = (e, index) => {
    e.preventDefault();
    const newTickersData = tickersData.filter((ticker, i) => i !== index);
    setTickersData(newTickersData);
  }

  //Boton para iniciar TRADE
  const trade = e => {
    e.preventDefault();
    try {
      tickersData.forEach(async (ticker) => {
        const response = await fetch('http://localhost:3001/auth/trade', { // CREAR RUTA TRADE EN SERVER
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'   // CHEQUEAR EN PAGINA API SI ESTA BIEN ESTA LOGICA
        },
        body: JSON.stringify({accessToken})   // CHEQUEAR EN PAGINA API SI ESTA BIEN ESTA LOGICA
      });

      // MANEJAR RESPUESTA 
      })
    } catch (error) {
      console.error('Error durante el trading:', error);
    }
  };


  return (
    <div className='container2'>
        <button className='button4 ' onClick={trade}>TRADE</button>
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
