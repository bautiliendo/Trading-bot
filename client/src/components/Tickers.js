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
  const [t2, setT2] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [caucionPesos, setCaucionPesos] = useState();
  const [caucionDolares, setCaucionDolares] = useState();
 

  useEffect(() => {
    setAccessToken(bearer.bearer.access_token);
  }, [bearer]);

  useEffect(() => {
    console.log("Acces token: "+ accessToken); 
  }, [accessToken]);

  useEffect(() => {
    setTickersData(tickers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("Tasa caución en pesos: "+ caucionPesos);
    console.log("Tasa caución en dolares: "+caucionDolares);
  }, [caucionDolares]);


  const anadirTicker = (e) => {
    e.preventDefault();
    const mercado = e.target.mercado.value;
    const simbolo = e.target.simbolo.value;
    const plazo = ["t0","t2"];
    const newTicker = { mercado, simbolo, plazo };
    setTickersData([...tickersData, newTicker]);
  };

  const eliminarTicker = (e, index) => {
    e.preventDefault();
    const newTickersData = tickersData.filter((ticker, i) => i !== index);
    setTickersData(newTickersData);
  };

  //Boton para iniciar TRADE / Obtener t2, t0 y cauciones
  const trade = async (event) => {
    event.preventDefault();
    if(accessToken){
      try {
        const promises = tickersData.map(async (ticker) => {
          const { mercado, simbolo, plazo } = ticker;
          const urlT2 = `http://localhost:3001/auth/trade?accessToken=${accessToken}&mercado=${mercado}&simbolo=${simbolo}&plazo=${plazo[1]}`;
          const responseT2 = await fetch(urlT2, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
  
          if (!responseT2.ok) {
            throw new Error("Error en el trade t2");
          } else {
            const dataT2 = await responseT2.json();
            const newObjT2 = {
              mercado,
              simbolo,
              // plazo,
              dataT2,
            };
            setT2((prevT2) => [...prevT2, newObjT2]);
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

        const caucionPromise = async () => {
          const urlCaucion = `http://localhost:3001/auth/caucion?accessToken=${accessToken}`;
          const responseCaucion = await fetch(urlCaucion, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!responseCaucion.ok) {
            throw new Error("Error en la obtencion de la caucion");
          } else {
            const dataCaucion = await responseCaucion.json();
            console.log(dataCaucion);
            //Verifica que la caucion en pesos sea correcta (> 25) Puede variar con el tiempo
            if(dataCaucion.titulos[0].tasaPromedio > 25){
              setCaucionPesos(dataCaucion.titulos[0].tasaPromedio)
            } else {
              throw new Error("Error en la obtencion de la caucion en pesos");
            }
            //Verifica que la caucion en dolares sea correcta ( generalmente < 2)
            if(dataCaucion.titulos[1].tasaPromedio < 2){
              setCaucionDolares(dataCaucion.titulos[1].tasaPromedio)
            } else {
              throw new Error("Error en la obtencion de la caución en dolares");
            }
          }
        }

        await Promise.all([caucionPromise()]);
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

  const handleNavigateToTable = (e) => {

    if (isDataReady) {
      navigate('/table', { state: { t0Data: t0, t2Data: t2, caucionPesos, caucionDolares } });
    } else {
       toast.error("Los datos de tickers no estan cargados")
    }
  };

  return (
    <div className="container2">
      {!isDataReady && (
        <button className="button4 " onClick={trade}>Iniciar Trade</button>  
      )}
      {isDataReady && (
        <button className="button5" onClick={handleNavigateToTable}>Ir a la tabla de datos</button>
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
