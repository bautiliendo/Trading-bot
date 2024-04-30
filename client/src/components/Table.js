// Table.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Table = () => {
  const location = useLocation();
  const { t0Data, t2Data, caucionPesos, caucionDolares } = location.state || {};
  const [aValues, setAValues] = useState([]);
  const [bValuesP, setBValuesP] = useState([]);
  const [bValuesD, setBValuesD] = useState([]);

  // Función para ordenar los datos por el campo 'simbolo' (alfabeticamente)
  const sortData = (data) => {
    return data.sort((a, b) => a.simbolo.localeCompare(b.simbolo));
  };

  // Datos ordenados
  const sortedT0Data = sortData(t0Data);
  const sortedT2Data = sortData(t2Data);

  useEffect(() => {
    console.log(sortedT0Data, sortedT2Data); //Muestra por consola dos arrays los datos ordenados
    console.log(
      "Caucion en pesos= " + caucionPesos,
      "Caucion en dolares= " + caucionDolares
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    calculateA();
    calculatebValuesP();
    calculatebValuesD();
  }, [sortedT0Data, sortedT2Data]); // se ejecuta automaticamente calculateA();

  //Logica para encontrar A ( t2/t0 )
  const calculateA = () => {
    const newAValues = sortedT0Data
      .map((t0Ticker, index) => {
        const t2Ticker = sortedT2Data[index];
        if (t0Ticker.dataT0 && t2Ticker.dataT2) {
          const a =
            (t2Ticker.dataT2.ultimoPrecio / t0Ticker.dataT0.ultimoPrecio - 1) *
            100;
          return { simbolo: t0Ticker.simbolo, a };
        }
        return null;
      })
      .filter(Boolean);

    setAValues(newAValues);
  };

  //Calcula valor de B(pesos) ( Caucion pesos/ 365 de lunes a miércoles) (jueves x3 y viernes x4)
  const calculatebValuesP = () => {
      const newBValuesP = (caucionPesos / 365); 
      setBValuesP(newBValuesP)
     
  };

 //Calcula valor de B(usd) ( Caucion dolares / 365 de lunes a miércoles) (jueves x3 y viernes x4)
  const calculatebValuesD = () => {
    const newBValuesD = (caucionDolares / 365);
    setBValuesD(newBValuesD)
    
};

  return (
    <div>
      <h2>Tabla de valores</h2>
      {t0Data && t0Data.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Símbolo</th>
              <th>Dias ? </th>
              <th>Mercado</th>
              <th>Moneda</th>
              <th>UltimoPrecio T0</th>
              <th>A (T2/T0)</th>
              <th>B (caucion TNA/ 365)</th>
              {/* Otras columnas según los datos de dataT0 */}
            </tr>
          </thead>
          <tbody>
            {sortedT0Data.map((ticker, index) => {
              const aValue = aValues.find(
                (value) => value.simbolo === ticker.simbolo
              );
              return (
                <tr key={index}>
                  <td>{ticker.simbolo}</td>
                  <td>{ticker.dias}</td>
                  <td>{ticker.mercado}</td>
                  <td>{ticker.dataT0.moneda}</td>
                  <td>{ticker.dataT0.ultimoPrecio}</td>
                  <td>{aValue ? aValue.a : "-"}</td>
                  <td>{ticker.dataT0.moneda === "peso_Argentino" ? (bValuesP) : (bValuesD)}</td>
                  {/* Otras celdas según los datos de dataT0 */}
                </tr>
              );
            })}
            <tr>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No hay datos para la tabla</p>
      )}
      <div>
      <p>B (caucion en pesos): {caucionPesos}</p>
      <p>B (caucion en dólares): {caucionDolares}</p>
    </div>
    </div>
  );
};
