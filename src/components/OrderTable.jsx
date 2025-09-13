    import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }); // Jan, Feb, Mar ...
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function OrderTable({rows}) {
  return (
    <TableContainer component={Paper}>
      <Table  aria-label="simple table">
        <TableHead sx={{ "& th": { fontWeight: "bold", color: "white", backgroundColor:"blue" } }} >
          <TableRow>
            <TableCell>Order Id</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Customer</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
            >
              <TableCell component="th" scope="row">
                {row._id}
              </TableCell>
              <TableCell align="right">{formatDate(row.createdAt)}</TableCell>
              <TableCell align="right">{row.customerName}</TableCell>
              <TableCell align="right">{row.totalAmount}</TableCell>
              <TableCell align="right">{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export default OrderTable