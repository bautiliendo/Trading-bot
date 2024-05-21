import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { tickers } from "../data/TickerList";
import { executeTrade } from '../helpers/tradeHelper'
import { navigateTable } from '../helpers/navigateTableHelper'

export const Tickers = () => {
  const navigate = useNavigate();
  const bearer = useContext(AuthContext);
  const [tickersData, setTickersData] = useState([]);
  const [accessToken, setAccessToken] = useState("Acces token nulo");
  const [t0, setT0] = useState([]);
  const [t2, setT2] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [caucionPesos, setCaucionPesos] = useState();
  const [caucionDolares, setCaucionDolares] = useState();

  useEffect(() => {
    setAccessToken(bearer.bearer.access_token);
  }, [bearer]);

  useEffect(() => {
    console.log("Acces token: " + accessToken);
  }, [accessToken]);

  useEffect(() => {
    setTickersData(tickers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("Tasa caución en pesos: " + caucionPesos);
    console.log("Tasa caución en dolares: " + caucionDolares);
  }, [caucionDolares]);

  const anadirTicker = (e) => {
    e.preventDefault();
    const mercado = e.target.mercado.value;
    const simbolo = e.target.simbolo.value;
    const plazo = ["t0", "t2"];
    const newTicker = { mercado, simbolo, plazo };
    setTickersData([...tickersData, newTicker]);
  };

  const eliminarTicker = (e, index) => {
    e.preventDefault();
    const newTickersData = tickersData.filter((ticker, i) => i !== index);
    setTickersData(newTickersData);
  };

  //Boton para iniciar TRADE 
  const trade = async (e) => {
    e.preventDefault();
    await executeTrade(accessToken, tickersData, setT0, setT2, setCaucionPesos, setCaucionDolares, setIsDataReady, navigate);
  }

  const handleNavigateToTable = (e) => {
    e.preventDefault();
    navigateTable(navigate, isDataReady, t0, t2, caucionPesos, caucionDolares);
  };

  return (
    <div className="container2">
      {!isDataReady && (
        <button className="button4 " onClick={trade}>
          Iniciar Trade
        </button>
      )}
      {isDataReady && (
        <button className="button5" onClick={handleNavigateToTable}>
          Ir a la tabla de datos
        </button>
      )}
      <div className="iniciar-trade-box">
        <h2 className="white">Agregar ticker</h2>
        <form className="form-tickers" onSubmit={anadirTicker}>
          <select name="mercado" className="input-small">
            <option value="BCBA">BCBA</option>
            <option value="NYSE">NYSE</option>
            <option value="NASDAQ">NASDAQ</option>
            <option value="AMEX">AMEX</option>
            <option value="BCS">BCS</option>
            <option value="ROFX">ROFX</option>
          </select>
          <input
            type="text"
            name="simbolo"
            placeholder="Símbolo"
            className="input-small"
          />
          <select name="plazo" className="input-small">
            {" "}
            <option value="">t0 ; t2</option>
          </select>
          <button type="submit" className="button2">
            Añadir
          </button>
        </form>
      </div>

      <h3 className="white">Tickers: </h3>
      <div className="tickers-container">
        {tickersData.map((ticker, index) => (
          <ul key={index} className="tickers">
            <li>
              MERCADO: <strong>{ticker.mercado} </strong>
              Símbolo: <strong className="blue">{ticker.simbolo} </strong>
              Plazo:
              <strong>
                {ticker.plazo[0]}; {ticker.plazo[1]}
              </strong>
              <button
                className="button3"
                data-index={index}
                onClick={(e) => eliminarTicker(e, index)}
              >
                Eliminar
              </button>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};
