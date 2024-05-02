// Table.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Table = () => {
  const location = useLocation();
  const { t0Data, t2Data, caucionPesos, caucionDolares } = location.state || {};
  const [aValues, setAValues] = useState([]);
  const [bValuesP, setBValuesP] = useState([]);
  const [bValuesD, setBValuesD] = useState([]);

  //Obtener dia de la semana  ( lunes a miercoles normal , jueves hay que multiplicar B x 3 y viernes B x 4)
  // (0 = domingo, 1 = lunes, 2 = martes, 3 = miercoles, 4 = jueves, 5 = viernes, 6 = sábado)
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
    console.log(sortedT0Data, sortedT2Data); //Muestra por consola dos arrays los datos ordenados
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
  }, [sortedT0Data, sortedT2Data, caucionPesos, caucionDolares]);

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

  return (
    <div className="body-table">
      <h2>Tabla de valores</h2>
      {t0Data && t0Data.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Símbolo</th>
              {/* <th>Dias ? </th> */}
              <th>Mercado</th>
              <th>Moneda</th>
              <th>UltimoPrecio T0</th>
              <th>A (T2/T0)</th>
              <th>B (caucion TNA/ 365)</th>
              <th>Comparacion A - B</th>
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
                  {/* <td>{ticker.dias}</td> */}
                  <td>{ticker.mercado}</td>
                  <td>{ticker.dataT0.moneda}</td>
                  <td>{ticker.dataT0.ultimoPrecio}</td>
                  <td>{aValue ? aValue.a : "-"}</td>
                  <td>
                    {ticker.dataT0.moneda === "peso_Argentino"
                      ? bValuesP
                      : bValuesD}
                  </td>
                  <td>
                    {aValue && ticker.dataT0.moneda
                      ? aValue.a -
                        (ticker.dataT0.moneda === "peso_Argentino"
                          ? bValuesP
                          : bValuesD)
                      : "-"}
                  </td>
                  {/* Otras celdas según los datos de dataT0 */}
                </tr>
              );
            })}
            <tr></tr>
          </tbody>
        </table>
      ) : (
        <p>No hay datos para la tabla</p>
      )}
      <div className="info-cauciones">
        <h4 className="cauciones"> Precio caucion en pesos: {caucionPesos}</h4>
        <ul>
          <li>
            B (caucion en pesos / 365): {caucionPesos / 365} (
            <strong>Jueves x3 = </strong>
            {(caucionPesos / 365) * 3}) ; (<strong>Viernes x4 = </strong>
            {(caucionPesos / 365) * 4})
          </li>
        </ul>
        <h4> Precio caucion en dólares: {caucionDolares}</h4>
        <ul>
          <li>
            B (caucion en dolares / 365): {caucionDolares / 365} (
            <strong>Jueves x3 = </strong>
            {(caucionDolares / 365) * 3}) ; (<strong>Viernes x4 = </strong>
            {(caucionDolares / 365) * 4})
          </li>
        </ul>
      </div>
    </div>
  );
};
