import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { NavLink } from "react-router-dom";



function InventoryTable({ rows }) {

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }); // Jan, Feb, Mar ...
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead
          sx={(theme) => ({
            "& th": {
              fontWeight: "bold",
              color: theme.palette.common.white,
              backgroundColor: theme.palette.primary.main, 
            },
          })}
        >
          <TableRow>
            <TableCell>SKU</TableCell>
            <TableCell align="right">Title</TableCell>
            <TableCell align="right">Cost</TableCell>
            <TableCell align="right">Available Qty</TableCell>
            <TableCell align="right">Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row._id}>
              <TableCell to={`/inventory/${row._id}`} scope="row" component={NavLink} >{row.sku}</TableCell>
              <TableCell align="right">{row.title}</TableCell>
              <TableCell align="right">{row.cost}</TableCell>
              <TableCell align="right">{row.availableQty}</TableCell>
              <TableCell align="right">{row.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default InventoryTable