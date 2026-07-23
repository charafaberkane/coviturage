import React from 'react';
import { css } from '@emotion/react';

export default function Table({ columns, data }) {
  // columns: [{ header: 'ID', accessor: 'id' }, ...]
  return (
    <div css={(theme) => css`overflow-x:auto;` }>
      <table css={(theme) => css`
        width: 100%;
        border-collapse: collapse;
        background: ${theme.colors.cardBackground};
        font-size: 0.9rem;
        th, td { padding: 0.75rem; text-align:left; }
        thead { background:${theme.colors.muted}; }
        tbody tr { border-bottom:1px solid ${theme.colors.border}; }
        tbody tr:hover { background: ${theme.colors.background}; }
      `}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.accessor}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col.accessor}>{row[col.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
