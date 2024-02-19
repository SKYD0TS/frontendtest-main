'use client'
import Image from "next/image"
import "./style.css"
import Form from "@/components/form"
import Datatable from "@/components/datatable"
import { Header } from "@tanstack/react-table"
import { ReactNode, useEffect, useState } from "react"
import { table } from "console"
// import { columns } from "@/components/column"


export default function Home() {
  const [loading, setLoading] = useState(true)
  const formcols = [
    { name: "username", type: "text", model: "text" },
    { name: "password", type: "text", model: "number" },
  ]


  const [columns, setColumns] = useState<any>([])
  // const [columns, setColumns] = useState([
  //   {
  //     accessorKey: "#",
  //     header: "#",
  //     className: 'AWHF',
  //     enableSorting: false,
  //     columnTemplate: "index"
  //   },
  //   {
  //     accessorKey: "username",
  //     header: "Username",
  //   },
  //   {
  //     accessorKey: "password",
  //     header: "Password",
  //     enableSorting: false,
  //   },
  //   {
  //     accessorKey: "action",
  //     header: "Action",
  //     enableSorting: false,
  //     cell: (props: any) => (
  //       <div>
  //         <button onClick={(e) => console.log(props.row.original)}>Edit</button>
  //         <button onClick={() => alert(props.row.original.id + props.row.original.username)}>Delete</button>
  //       </div>)
  //   },
  // ])

  const [data, setData] = useState<any>([])
  // const [data, setData] = useState([
  //   { id: 0, username: "1", password: "password" },
  //   { id: 1, username: "2", password: "password" },
  //   { id: 2, username: "3", password: "password" },
  //   { id: 3, username: "4", password: "password" },
  //   { id: 4, username: "231", password: "password" },
  //   { id: 5, username: "a23w", password: "password" },
  //   { id: 6, username: "awasd", password: "password" },
  //   { id: 7, username: "aw", password: "password" },
  //   { id: 8, username: "a2asn", password: "password" },
  //   { id: 9, username: "ax1n", password: "password" },
  //   { id: 10, username: "aan", password: "password" },
  //   { id: 12, username: "aaxfn", password: "password" },
  //   { id: 13, username: "arfww", password: "password" },
  //   { id: 14, username: "231", password: "password" },
  //   { id: 15, username: "awasd", password: "password" },
  //   { id: 16, username: "aan", password: "password" },
  //   { id: 17, username: "aaxfn", password: "password" },

  // ])

  useEffect(() => {
    async function fetchData() {
      await fetch('http://127.0.0.1:8000/api/col').then(r => r.json()).then(d => {
        console.log(d.columns, d.data)
        setColumns(d.columns)
        setData(d.data)
        setLoading(false)
      })
    }
    fetchData()
  }, [])

  if (loading) { return <>..</> }

  return (
    <main>
      <div>
        <Form columns={formcols} />
      </div>
      <div>
        <Datatable columns={columns} data={data} />

        <button onClick={() => { console.log(columns) }}>log</button>
        {/* <button onClick={() => {
          const newData = { id: data?.at(-1)?.id ?? -0, username: Date.now().toString(), password: 'password' }
          setData([newData, ...data])
        }}>ADD</button> */}
      </div>
    </main>
  )
}
