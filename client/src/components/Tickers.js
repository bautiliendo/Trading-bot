import React, { useState, useEffect, useContext } from "react";
import "../index.css";
import { tickers } from "./TickerList";
import AuthContext from "./AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom'

export const Tickers = () => {
  const navigate = useNavigate()
  const bearer = useContext(AuthContext);
  const [tickersData, setTickersData] = useState([]);
  const [accessToken, setAccessToken] = useState("Acces token nulo");
  const [t0, setT0] = useState([]);
  const [t1, setT1] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
 

  useEffect(() => {
    setAccessToken(bearer.bearer.access_token);
  }, [bearer]);

  useEffect(() => {
    console.log(accessToken); 
  }, [accessToken]);

  useEffect(() => {
    setTickersData(tickers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(tickersData);
  }, [tickersData]);

  useEffect(() => {
    console.log(t1);
  }, [t1]);
  
  useEffect(() => {
    console.log(t0);
  }, [t0]);

  //Boton para añadir nuevos tickers
  const anadirTicker = (e) => {
    e.preventDefault();
    const mercado = e.target.mercado.value;
    const simbolo = e.target.simbolo.value;
    const plazo = e.target.plazo.value;
    const newTicker = { mercado, simbolo, plazo };
    setTickersData([...tickersData, newTicker]);
  };

  //Boton para eliminar tickers
  const eliminarTicker = (e, index) => {
    e.preventDefault();
    const newTickersData = tickersData.filter((ticker, i) => i !== index);
    setTickersData(newTickersData);
  };

  //Boton para iniciar TRADE
  const trade = async (event) => {
    event.preventDefault();
    if(accessToken){
      try {
        const promises = tickersData.map(async (ticker) => {
          const { mercado, simbolo, plazo } = ticker;
          const urlT1 = `http://localhost:3001/auth/trade?accessToken=${accessToken}&mercado=${mercado}&simbolo=${simbolo}&plazo=${plazo[1]}`;
          const responseT1 = await fetch(urlT1, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
  
          if (!responseT1.ok) {
            throw new Error("Error en el trade t1");
          } else {
            const dataT1 = await responseT1.json();
            const newObjT1 = {
              mercado,
              simbolo,
              // plazo,
              dataT1,
            };
            setT1((prevT1) => [...prevT1, newObjT1]);
          }
        });
  
        await Promise.all(promises);
        
        // Fetch t0 data for each ticker
        const t0Promises = tickersData.map(async (ticker) => {
          const { mercado, simbolo, plazo } = ticker;
          const urlT0 = `http://localhost:3001/auth/trade?accessToken=${accessToken}&mercado=${mercado}&simbolo=${simbolo}&plazo=${plazo[0]}`;
          const responseT0 = await fetch(urlT0, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
  
          if (!responseT0.ok) {
            throw new Error("Error en el trade T0");
          } else {
            const dataT0 = await responseT0.json();
            const newObjtT0 = {
              mercado,
              simbolo,
              // plazo,
              dataT0
            };
            setT0((prevT0) => [...prevT0, newObjtT0]);
          }
        });
  
        await Promise.all(t0Promises);
        toast.success("Ya puedes acceder a los datos");
        setIsDataReady(true);
  
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
    
    else {
      toast.error("Acces token expirado")
      navigate("/")
    }
  };
  const handleNavigateToTable = () => {
    if (isDataReady) {
      navigate('/table', { state: { t0Data: t0, t1Data: t1 } });
    } else {
      toast.error("Los datos de tickers no estan cargados")
    }
  };

  return (
    <div className="container2">
      <button className="button4 " onClick={trade}>Iniciar</button>  
       {/* <button className="button " onClick={table}/> */}
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
          {/* Arreglar que se añada automaticamente ambos plazos*/}
          <option value="t0">t0</option>
          <option value="t1">t1</option>
        </select>
        <button type="submit" className="button2">
          Añadir
        </button>
      </form>
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
      <button className="button5" onClick={handleNavigateToTable}>Ir a la tabla de datos</button>
    </div>
  );
};
