import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Table = () => {
  const location = useLocation();
  const { t0Data, t2Data, caucionPesos, caucionDolares } = location.state || {};
  const [aValues, setAValues] = useState([]);
  const [bValuesP, setBValuesP] = useState([]);
  const [bValuesD, setBValuesD] = useState([]);

  const [caucionPesosManual, setCaucionPesosManual] = useState(caucionPesos);
  const [caucionDolaresManual, setCaucionDolaresManual] = useState(caucionDolares);

  const getCurrentDay = () => {
    const today = new Date();
    return today.getDay();
  };

  // Ordenar los datos por el campo 'simbolo' (alfabeticamente)
  const sortData = (data) => {
    return data.sort((a, b) => a.simbolo.localeCompare(b.simbolo));
  };
  const sortedT0Data = sortData(t0Data);
  const sortedT2Data = sortData(t2Data);

  useEffect(() => {
    calculateA();
    calculateBvalues();
  }, [sortedT0Data, sortedT2Data, caucionPesos, caucionDolares]);

  // Lógica para encontrar A (puntaCompradoraT2 / puntaVendedoraT0 - 1) x 100
  const calculateA = () => {
    const newAValues = sortedT0Data
      .map((t0Ticker, index) => {
        const t2Ticker = sortedT2Data[index];
        if (
          t0Ticker.dataT0 &&
          t2Ticker.dataT2 &&
          t0Ticker.dataT0.puntas.length > 0 &&
          t2Ticker.dataT2.puntas.length > 0
        ) {
          // Obtener la primera punta vendedora en T0
          const puntaVendedoraT0 = t0Ticker.dataT0.puntas[0].precioVenta;

          // Obtener la primera punta compradora en T2
          const puntaCompradoraT2 = t2Ticker.dataT2.puntas[0].precioCompra;

          // Calcular A
          const a = (puntaCompradoraT2 / puntaVendedoraT0 - 1) * 100;
          return {
            simbolo: t0Ticker.simbolo,
            a,
            puntaVendedoraT0,
            puntaCompradoraT2,
          };
        }
        return null;
      })
      .filter(Boolean);

    setAValues(newAValues);
  };

  // Función para calcular el valor de B según el día de la semana
  const calculateBValue = (caucion) => {
    const day = getCurrentDay();

    switch (day) {
      case 0:
      case 6:
        return 0;
      case 1:
      case 2:
      case 3:
        return (caucion / 365) * 2;
      case 4:
        return (caucion / 365) * 4;
      case 5:
        return (caucion / 365) * 4;
      default:
        return 0;
    }
  };

  // Función para calcular los valores de B en pesos y dólares llamando la anterior funcion calculateBValue
  const calculateBvalues = () => {
    const bValuePesos = calculateBValue(caucionPesosManual);
    const bValueDolares = calculateBValue(caucionDolaresManual);
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
            Precio caucion en pesos: {formatValue(caucionPesosManual)}
          </h4>
          <ul>
            <li>
              B (caución en pesos / 365)
              <strong> Lunes - miércoles x 2 =</strong>
              {formatValue((caucionPesosManual / 365) * 2)};<strong> Jueves x4 = </strong>
              {formatValue((caucionPesosManual / 365) * 4)};<strong> Viernes x4 = </strong>
              {formatValue((caucionPesosManual / 365) * 4)}
            </li>
          </ul>
          <h4>Precio caución en dólares: {formatValue(caucionDolaresManual)}</h4>
          <ul>
            <li>
              B (caución en Dólares / 365)
              <strong> Lunes - miércoles x 2 =</strong>
              {formatValue((caucionDolaresManual / 365) * 2)};<strong> Jueves x4 = </strong>
              {formatValue((caucionDolaresManual / 365) * 4)};<strong> Viernes x4 = </strong>
              {formatValue((caucionDolaresManual / 365) * 4)}
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
                <th>Punta Compradora T2</th>
                <th>A (T2/T0 - 1) x 100</th>
                <th>B (caucion TNA/ 365)x2 (JU x 4)-(VI X 4)</th>
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
                    <td>{aValue ? aValue.puntaCompradoraT2 : "-"}</td>
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
