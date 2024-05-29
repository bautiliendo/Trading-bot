import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { calculateAHelper } from "../helpers/calculateAHelper";
import { calculateBValueHelper } from "../helpers/calculateBHelper";
import '../assets/table.css'

export const Table = () => {
  const location = useLocation();
  const { t0Data, t1Data, caucionPesos, caucionDolares } = location.state || {};
  const [aValues, setAValues] = useState([]);
  const [bValuesP, setBValuesP] = useState([]);
  const [bValuesD, setBValuesD] = useState([]);
  const [caucionPesosManual, setCaucionPesosManual] = useState(caucionPesos);
  const [caucionDolaresManual, setCaucionDolaresManual] = useState(caucionDolares);

  // Ordenar los datos por el campo 'simbolo' (alfabeticamente)
  const sortData = (data) => {
    return data.sort((a, b) => a.simbolo.localeCompare(b.simbolo));
  };
  const sortedT0Data = sortData(t0Data);
  const sortedt1Data = sortData(t1Data);

  useEffect(() => {
    calculateA();
    calculateBvalues();
    console.log( sortedT0Data, sortedt1Data )
  }, [sortedT0Data, sortedt1Data, caucionPesos, caucionDolares]);

  // Lógica para encontrar A (puntaCompradorat1 / puntaVendedoraT0 - 1) x 100
  const calculateA = () => {
    const newAValues = calculateAHelper(sortedT0Data, sortedt1Data);
    setAValues(newAValues)
  }

  // Función para calcular los valores de B en pesos y dólares llamando la anterior funcion calculateBValue
  const calculateBvalues = () => {
    const bValuePesos = calculateBValueHelper(caucionPesosManual);
    const bValueDolares = calculateBValueHelper(caucionDolaresManual);
    setBValuesP(bValuePesos);
    setBValuesD(bValueDolares);
  };


  //Cambiar manualmente precio cauciones
  const cambiarCaucionP = (e) => {
    e.preventDefault();
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      setCaucionPesosManual(newValue);
      calculateBvalues();
    }
  };
  const cambiarCaucionD = (e) => {
    e.preventDefault();
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      setCaucionDolaresManual(newValue);
      calculateBvalues();
    }
  };

  const formatValue = (value) => (isNaN(value) ? "N/A" : value.toFixed(10));

  return (
    <div className="body-table">
      <div className="table-container">
        <h2 className="h2">Tabla de valores</h2>
        <div className="info-cauciones">
          <h4 className="cauciones">
            Precio caucion en pesos: {(caucionPesosManual)}
          </h4>
          <ul>
            <li>
              B (caución en pesos / 365)
              <strong> Lunes - Jueves =</strong> {formatValue(caucionPesosManual / 365)};
              <strong> Viernes x3 = </strong> {formatValue((caucionPesosManual / 365) * 3)}
            </li>
          </ul>
          <h4>Precio caución en dólares: {(caucionDolaresManual)}</h4>
          <ul>
            <li>
              B (caución en Dólares / 365)
              <strong> Lunes - Jueves =</strong> {formatValue(caucionDolaresManual / 365)};
              <strong> Viernes x3 = </strong> {formatValue((caucionDolaresManual / 365) * 3)}
            </li>
          </ul>
          <form>
            <label htmlFor="fname">Cambiar valor caución pesos</label>
            <input
              type="text"
              id="fname"
              name="fname"
              onChange={cambiarCaucionP}
              placeholder="Añadir 00 al final. Ej: 22.00"
            /> 
            
            <label htmlFor="lname">Cambiar valor caución usd</label>
            <input
              type="text"
              id="lname"
              name="lname"
              onChange={cambiarCaucionD}
              placeholder="Añadir 00 al final. Ej: 2.00"
            />
          </form>
        </div>
        {t0Data && t0Data.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Símbolo</th>
                <th>Mercado</th>
                <th>Moneda</th>
                <th>UltimoPrecio T0</th>
                <th>Punta Vendedora T0</th>
                <th>Punta Compradora T1</th>
                <th>A (T1/T0 - 1) x 100</th>
                <th>B (caucion TNA/ 365) (VI X 3)</th>
                <th>Comparacion A - B</th>
              </tr>
            </thead>
            <tbody>
              {sortedT0Data
                .map((ticker, index) => {
                  const aValue = aValues.find(
                    (value) => value.simbolo === ticker.simbolo
                  );
                  const bValue =
                    ticker.dataT0.moneda === "peso_Argentino"
                      ? bValuesP
                      : bValuesD;
                  const comparison =
                    aValue &&
                    typeof aValue.a === "number" &&
                    typeof bValue === "number" &&
                    (aValue.a - bValue != Infinity)
                      ? aValue.a - bValue
                      : null;
                  return { ticker, aValue, bValue, comparison };
                })
                .filter((item) => item.comparison !== null)
                .sort((a, b) => b.comparison - a.comparison)
                .map(({ ticker, aValue, bValue, comparison }, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: comparison > 0 ? "#d4edda" : "inherit",
                    }}
                  >
                    <td>{ticker.simbolo}</td>
                    <td>{ticker.mercado}</td>
                    <td>{ticker.dataT0.moneda}</td>
                    <td>{ticker.dataT0.ultimoPrecio}</td>
                    <td>{aValue ? aValue.puntaVendedoraT0 : "-"}</td>
                    <td>{aValue ? aValue.puntaCompradorat1 : "-"}</td>
                    <td>{aValue ? formatValue(aValue.a) : "-"}</td>
                    <td>{formatValue(bValue)}</td>
                    <td>{formatValue(comparison)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p>No hay datos para la tabla</p>
        )}
      </div>
    </div>
  );
};
