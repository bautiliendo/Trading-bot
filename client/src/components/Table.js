// Table.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const Table = () => {
  const location = useLocation();
  const { t0Data, t1Data } = location.state || {};
  const [aValues, setAValues] = useState([]);

  // Función para ordenar los datos por el campo 'simbolo'
  const sortData = (data) => {
    return data.sort((a, b) => a.simbolo.localeCompare(b.simbolo));
  };

  // Datos ordenados
  const sortedT0Data = sortData(t0Data);
  const sortedT1Data = sortData(t1Data);

  useEffect(() => {
    console.log(sortedT0Data, sortedT1Data);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    calculateA();
  }, [sortedT0Data, sortedT1Data]);

  //Logica para encontrar A ( t1/t0 ) 
  const calculateA = () => {
    const newAValues = sortedT0Data.map((t0Ticker, index) => {
      const t1Ticker = sortedT1Data[index];
      if (t0Ticker.dataT0 && t1Ticker.dataT1) {
        const a = t1Ticker.dataT1.ultimoPrecio / t0Ticker.dataT0.ultimoPrecio;
        return { simbolo: t0Ticker.simbolo, a };
      }
      return null;
    }).filter(Boolean);
  
    setAValues(newAValues);
  };

  return (
    <div>
      <h2>Tabla T0</h2>
      {t0Data && t0Data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Símbolo</th>
              <th>UltimoPrecio</th>
              <th>A(t1/t0)</th>
              {/* Otras columnas según los datos de dataT0 */}
            </tr>
          </thead>
          <tbody>
            {sortedT0Data.map((ticker, index) => {
              const aValue = aValues.find((value) => value.simbolo === ticker.simbolo);
              return (
                <tr key={index}>
                <td>{ticker.simbolo}</td>
                <td>{ticker.dataT0.ultimoPrecio}</td>
                <td>{aValue ? aValue.a : '-'}</td>
                {/* Otras celdas según los datos de dataT0 */}
              </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No hay datos para la tabla T0</p>
      )}

      <h2>Tabla T1</h2>
      {t1Data && t1Data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Símbolo</th>
              <th>UltimoPrecio</th>
              <th>A(t1/t0)</th>
            </tr>
          </thead>
          <tbody>
          {sortedT1Data.map((ticker, index) => {
              const aValue = aValues.find((value) => value.simbolo === ticker.simbolo);
              return (
                <tr key={index}>
                <td>{ticker.simbolo}</td>
                <td>{ticker.dataT1.ultimoPrecio}</td>
                <td>{aValue ? aValue.a : '-'}</td>
                {/* Otras celdas según los datos de dataT0 */}
              </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No hay datos para la tabla T1</p>
      )}
      
    </div>
  );
};