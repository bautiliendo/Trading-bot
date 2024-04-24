import React from 'react'

export const Table = ({t1}, {t0}) => {
  return (
    <div>
        <table>
  <tr>
    <th>Simbolo</th>
    <th>Precio t0</th>
    <th>Precio t1</th>
  </tr>
  <tr>
    <td>{JSON.stringify(t1[1].simbolo)}</td>
    <td></td>
    <td>Germany</td>
  </tr>
  <tr>
    <td>Centro comercial Moctezuma</td>
    <td>Francisco Chang</td>
    <td>Mexico</td>
  </tr>
</table>
    </div>
  )
}
