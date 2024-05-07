import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Table = () => {
  const location = useLocation();
  const { t0Data, t2Data, caucionPesos, caucionDolares } = location.state || {};
  const [aValues, setAValues] = useState([]);
  const [bValuesP, setBValuesP] = useState([]);
  const [bValuesD, setBValuesD] = useState([]);
  const [allSortedData, setAllSortedData] = useState([]);

  const getCurrentDay = () => {
    const today = new Date();
    return today.getDay();
  };

  // Función para ordenar los datos por el campo 'simbolo' (alfabeticamente)
  const sortData = (data) => {
    return data.sort((a, b) => a.simbolo.localeCompare(b.simbolo));
  };

  // Datos ordenados
  const sortedT0Data = sortData(t0Data);
  const sortedT2Data = sortData(t2Data);

  useEffect(() => {
    console.log(sortedT0Data, sortedT2Data);
    console.log(
      "Caucion en pesos= " + caucionPesos,
      "Caucion en dolares= " + caucionDolares
    );
    console.log("Dia de la semana: " + getCurrentDay());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    calculateA();
    calculateBvalues();
    setAllSortedData(sortedT0Data.concat(sortedT2Data));
  }, [sortedT0Data, sortedT2Data, caucionPesos, caucionDolares]);

  //Logica para encontrar A ( t2/t0 - 1 )  x 100

// Lógica para encontrar A (puntaCompradoraT2 / puntaVendedoraT0 - 1) x 100
const calculateA = () => {
  const newAValues = sortedT0Data.map((t0Ticker, index) => {
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
      const a = ((puntaCompradoraT2 / puntaVendedoraT0) - 1) * 100;
      return { simbolo: t0Ticker.simbolo, a , puntaVendedoraT0, puntaCompradoraT2};
    }
    return null;
  }).filter(Boolean);

  setAValues(newAValues);
};

  // Función para calcular el valor de B según el día de la semana
  const calculateBValue = (caucion) => {
    const day = getCurrentDay();

    switch (day) {
      case 0: // Domingo
      case 6: // Sábado
        return 0; // No se calcula B los fines de semana
      case 1: // Lunes
      case 2: // Martes
      case 3: // Miércoles
        return caucion / 365;
      case 4: // Jueves
        return (caucion / 365) * 3;
      case 5: // Viernes
        return (caucion / 365) * 4;
      default:
        return 0;
    }
  };

  // Función para calcular los valores de B en pesos y dólares llamando la anterior funcion calculateBValue
  const calculateBvalues = () => {
    const bValuePesos = calculateBValue(caucionPesos);
    const bValueDolares = calculateBValue(caucionDolares);
    setBValuesP(bValuePesos);
    setBValuesD(bValueDolares);
  };

  useEffect(() => {
    console.log("Array con t0 + t2 ordenado por símbolo:", allSortedData);
  }, [allSortedData]);


//RETURN ORDENDADO POR OPORTUNIDAD DE TRADE
return (
  <div className="body-table">
    <div className="table-container">
      <h2 className="h2">Tabla de valores</h2>
      <div className="info-cauciones">
        <h4 className="cauciones">Precio caucion en pesos: {caucionPesos}</h4>
        <ul>
          <li>
            B (caucion en pesos / 365): {caucionPesos / 365} (
            <strong>Jueves x3 = </strong>
            {(caucionPesos / 365) * 3}) ; (<strong>Viernes x4 = </strong>
            {(caucionPesos / 365) * 4})
          </li>
        </ul>
        <h4>Precio caucion en dólares: {caucionDolares}</h4>
        <ul>
          <li>
            B (caucion en dolares / 365): {caucionDolares / 365} (
            <strong>Jueves x3 = </strong>
            {(caucionDolares / 365) * 3}) ; (<strong>Viernes x4 = </strong>
            {(caucionDolares / 365) * 4})
          </li>
        </ul>
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
              <th>B (caucion TNA/ 365) (JU x 3) (VI X 4)</th>
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
                  ticker.dataT0.moneda === "peso_Argentino" ? bValuesP : bValuesD;
                const comparison =
                  aValue &&
                  typeof aValue.a === "number" &&
                  typeof bValue === "number"
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
                  <td>{aValue ? aValue.a : "-"}</td>
                  <td>{bValue}</td>
                  <td>{comparison}</td>
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
}