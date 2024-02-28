'use client'
import Image from "next/image"
import "./style.css"
import Form from "@/components/form"
import Datatable from "@/components/datatable"
import { Header } from "@tanstack/react-table"
import { ReactNode, useEffect, useRef, useState } from "react"
import { table } from "console"
const API_URL = "http://127.0.0.1:8000"
// import { columns } from "@/components/column"

function handleUpdate(id: string, item: any) {
  console.log('handledit ' + id, item)
}

function handleDelete(id: string) {
  console.log('handledele ' + id)
}




export default function Home() {
  const [loading, setLoading] = useState(true)
  const [apiUrl, setApiUrl] = useState('')
  const formModal = useRef(null);
  const [formModalState, setFormModalState] = useState(false)

  function closeModal() {
    setFormModalState(false)
  }

  const formcols = [
    { name: "password", type: "text", model: "number" },
    { name: "username", type: "text", model: "text" },
  ]

  const functions: Record<string, Function> = {
    handleDelete: handleDelete,
    handleUpdate: handleUpdate,
  }

  // const [columns, setColumns] = useState<any>([])
  const [columns, setColumns] = useState([
    {
      accessorKey: "#",
      header: "#",
      className: 'AWHF',
      enableSorting: false,
      children: [{ function: 'index', args: ['absoluteRowPosition', 'pageSize', 'pageIndex'] }]
    },
    {
      accessorKey: "username",
      header: "Username",
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
      children: [
        {
          type: "button",
          props: { onClick: { function: 'handleUpdate', args: ['originalData'] } },
          children: "edit"
        },
        {
          type: "button",
          props: { onClick: { function: 'handleDelete', args: ['originalData'] } },
          children: "delete"
        },
      ]
    }
  ])

  // const [data, setData] = useState<any>([])
  const [data, setData] = useState([
    { id: 110, username: "1", password: "password" },
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
  ])

  useEffect(() => {
    // return console.log(formModal.current)
  })

  useEffect(() => {
    const fm = formModal.current as any
    if (formModalState) {
      fm.showModal();
    } else {
      fm.close();
    }
  }, [formModalState]);

  // useEffect(() => {
  //   async function fetchData() {
  //     const url = API_URL + '/api/col'
  //     console.log(url)
  //     setApiUrl(url)
  //     await fetch("http://localhost:8000/api/col")
  //       .then(d => { console.log(d); return d })
  //       .then(r => r.ok ? r.json() : Promise.reject)
  //       .then(d => {
  //         console.log(d.columns, d.data)
  //         setColumns(d.columns)
  //         setData(d.data)
  //         setLoading(false)
  //       }).catch(err => Promise.reject<any>(new Error(err)))
  //   }
  //   fetchData()
  // }, [])

  // if (loading) { return <>..</> }

  return (
    <main>
      <div>
        <button
          onClick={() => setFormModalState(true)}
        >OPEN DIALGO</button>
        <dialog className="dialog" id="form" ref={formModal} onCancel={closeModal}>
          <Form columns={formcols} />
        </dialog>
      </div>
      <div>
        <hr />
        <hr />
        <br />
        <Datatable columns={columns} data={data} apiUrl={apiUrl} handlers={functions} />

        <br />
        <hr />
        <hr />
        <button onClick={() => { console.log(columns) }}>log</button>
        {/* <button onClick={() => {
          const newData = { id: data?.at(-1)?.id ?? -0, username: Date.now().toString(), password: 'password' }
          setData([newData, ...data])
        }}>ADD</button> */}
      </div>
    </main>
  )
}
