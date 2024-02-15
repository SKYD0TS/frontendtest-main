'use client'
import Image from "next/image";
import "./style.css";
import Form from "@/components/form";
import Datatable from "@/components/datatable";
import { Header } from "@tanstack/react-table";
import { ReactNode, useEffect, useState } from "react";
// import { columns } from "@/components/column";
export function SortableHeader(props: { column: any }) {
  <button>{props.column.columnDef.accessorKey}</button>
}

export default function Home() {
  const formcols = [
    { name: "username", type: "text", model: "text" },
    { name: "password", type: "text", model: "number" },
  ];


  const columns = [
    // {
    //   accessorKey: "#",
    //   header: "#",
    //   className: 'AWHF',
    //   enableSorting: false,
    //   meta: { sortable: false },
    //   cell: (rows: any) => <>{(rows.row.index + 1)}</>,
    // },
    {
      accessorKey: "username",
      header: "Username",
      cell: (row: any) => { return <p>{row.getValue()}</p> }
    },
    {
      accessorKey: "password",
      header: "Password",
      enableSorting: false,
    },
    {
      accessorKey: "action",
      header: "Action",
      enableSorting: false,
      cell: (rows: any) => (
        <div>
          <button onClick={(e) => console.log(rows.row.original)}>Edit</button>
          <button onClick={() => alert(rows.row.original.id + rows.row.original.username)}>Delete</button>
        </div>)
    },
  ];

  const [data, setData] = useState([
    { id: 0, username: "1", password: "password" },
    { id: 1, username: "2", password: "password" },
    { id: 2, username: "3", password: "password" },
    { id: 3, username: "4", password: "password" },
    { id: 4, username: "231", password: "password" },
    { id: 5, username: "a23w", password: "password" },
    { id: 6, username: "awasd", password: "password" },
    { id: 7, username: "aw", password: "password" },
    { id: 8, username: "a2asn", password: "password" },
    { id: 9, username: "ax1n", password: "password" },
    { id: 10, username: "aan", password: "password" },
    { id: 12, username: "aaxfn", password: "password" },
    { id: 13, username: "arfww", password: "password" },
    { id: 14, username: "231", password: "password" },
    { id: 15, username: "awasd", password: "password" },
    { id: 16, username: "aan", password: "password" },
    { id: 17, username: "aaxfn", password: "password" },

  ]);

  return (
    <main>
      <div>
        <Form columns={formcols} />
      </div>
      <div>
        <Datatable columns={columns} data={data} />

        <button onClick={() => {
          const newData = { id: data?.at(-1)?.id ?? -0, username: Date.now().toString(), password: 'password' }
          setData([newData, ...data])
        }}>ADD</button>
      </div>
    </main>
  );
}
