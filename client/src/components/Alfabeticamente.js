//RETURN SIMBOLOS ORDENADOS ALFABETICAMENTE
//   return (
//     <div className="body-table">
//       <h2>Tabla de valores</h2>
//       {t0Data && t0Data.length > 0 ? (
//         <table className="table">
//           <thead>
//             <tr>
//               <th>Símbolo</th>
//               {/* <th>Dias ? </th> */}
//               <th>Mercado</th>
//               <th>Moneda</th>
//               <th>UltimoPrecio T0</th>
//               <th>A (T2/T0 - 1) x 100</th>
//               <th>B (caucion TNA/ 365) (JU x 3) (VI X 4)</th>
//               <th>Comparacion A - B</th>
//               {/* Otras columnas según los datos de dataT0 */}
//             </tr>
//           </thead>
//           <tbody>
//             {sortedT0Data.map((ticker, index) => {
//               const aValue = aValues.find((value) => value.simbolo === ticker.simbolo);
//               const bValue = ticker.dataT0.moneda === "peso_Argentino" ? bValuesP : bValuesD;

//               return (
//                 <tr key={index}>
//                   <td>{ticker.simbolo}</td>
//                   <td>{ticker.mercado}</td>
//                   <td>{ticker.dataT0.moneda}</td>
//                   <td>{ticker.dataT0.ultimoPrecio}</td>
//                   <td>{aValue ? aValue.a : "-"}</td>
//                   <td><td>{bValue}</td></td>
//                   <td>
//                     {aValue ? 
//                     aValue.a - bValue
//                     : 
//                     "No hay data de puntas"}
//                   </td>
//                 </tr>
//               );
//             })}
//             <tr></tr>
//           </tbody>
//         </table>
//       ) : (
//         <p>No hay datos para la tabla</p>
//       )}
//       <div className="info-cauciones">
//         <h4 className="cauciones"> Precio caucion en pesos: {caucionPesos}</h4>
//         <ul>
//           <li>
//             B (caucion en pesos / 365): {caucionPesos / 365} (
//             <strong>Jueves x3 = </strong>
//             {(caucionPesos / 365) * 3}) ; (<strong>Viernes x4 = </strong>
//             {(caucionPesos / 365) * 4})
//           </li>
//         </ul>
//         <h4> Precio caucion en dólares: {caucionDolares}</h4>
//         <ul>
//           <li>
//             B (caucion en dolares / 365): {caucionDolares / 365} (
//             <strong>Jueves x3 = </strong>
//             {(caucionDolares / 365) * 3}) ; (<strong>Viernes x4 = </strong>
//             {(caucionDolares / 365) * 4})
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };
