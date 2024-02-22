'use client'
import {
    SortingState,
    ColumnSort,
    ColumnDef,
    getCoreRowModel,
    useReactTable,
    flexRender,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnFiltersState
} from "@tanstack/react-table"
import { ReactNode, createElement, useEffect, useState } from "react"
import style from './datatable.module.css'

// export function SortableHeader(props: { column: any }) {
//     <button>{props.column.columnDef.accessorKey}</button>
// }


// createReactElement({
//     type: 'div',
//     props: { className: 'container' },
//     children: [
//         { type: "button", props: { onClick: 'handleEdit' }, children: "edit" },
//         { type: 'i', props: { className: 'icon-1' }, children: null },
//         'this is a string',
//         {
//             type: 'div',
//             props: { className: 'nested-container' },
//             children: [
//                 'Nested content',
//                 {
//                     type: 'p',
//                     props: null,
//                     children: ['More nested content']
//                 }
//             ]
//         }
//     ]
// })

// !!NO TYPE
function createReactElement({ type, props, children }: any) {
    const childElements: Array<any> = Array.isArray(children)
        ? children.map(child =>
            typeof child === 'object' ? createReactElement(child) : child
        )
        : [children];
    return createElement(type, { ...props, className: style[props?.className ?? type] }, ...childElements);
}

type ERUDHandlers = {
    updateItemHandler?: (id: string, item: any) => void
    deleteItemHandler?: (id: string) => void
}

export default function Datatable(props: { data: any[], columns: ColumnDef<any>[], apiUrl: string, handlers?: ERUDHandlers }) {

    const [columns, setColumns] = useState<any>(props.columns)
    const [data, setData] = useState<any>(props.data)

    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const ERUD = props.handlers

    // if (ERUD?.deleteItemHandler) {
    //     ERUD.deleteItemHandler('4')
    // }

    const table = useReactTable({
        columns: columns,
        data: data,
        state: {
            sorting,
            pagination: { pageIndex, pageSize },
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

    })
    useEffect(() => setPageIndex(0), [sorting])
    // useEffect(() => console.log(columns), [columns])

    return (<>
        <div>
            <label htmlFor="search">Search:</label>
            <input
                onChange={(e) => { table.setGlobalFilter(e.target.value) }}
                id="search"
                type="text" />
        </div>
        <table className={style.datatable}>
            <thead>
                {table.getHeaderGroups().map((hg) =>
                    <tr key={hg.id}>
                        {hg.headers.map((h) => {
                            return <th key={h.id}>{
                                h.column.getCanSort() ?
                                    <button
                                        onClick={(e) => { h.column.toggleSorting(h.column.getIsSorted() === "asc") }}
                                        className={style.ghostButton} key={h.id}>{(h.column.columnDef.header ?? "-") as string}</button>
                                    :
                                    flexRender(
                                        h.column.columnDef.header,
                                        h.getContext()
                                    )
                            }</th>
                        })}
                    </tr>
                )}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((data, dn) => {
                    return <tr key={data.id}>{data.getVisibleCells().map((c) => {
                        const columnDef = c.column.columnDef as any
                        const originalData = c.row.original as any

                        switch (columnDef.columnTemplate?.template) {
                            case "index":
                                return <td key={c.id}>{(dn + 1) + (pageSize * pageIndex)}</td>
                            case "action":
                                return <td key={c.id}>
                                    {columnDef.columnTemplate.templateProps.children.map((p: any, pn: number) => {
                                        if (p.type == 'button') {
                                            return <button key={pn}
                                                onClick={() => {
                                                    p.action === 'update'
                                                        ? props.handlers?.updateItemHandler?.(originalData.id, originalData)
                                                        : p.action === 'delete'
                                                            ? props.handlers?.deleteItemHandler?.(originalData.id)
                                                            : null
                                                }}
                                            >{p.text}</button>
                                        }
                                    })}
                                </td>
                            default:
                                return <td key={c.id}>{
                                    flexRender(
                                        c.column.columnDef.cell,
                                        c.getContext()
                                    )
                                }</td>
                        }
                    })}</tr>
                })}
            </tbody>
        </table >
        <div>
            <p>Pagination:</p>
            <button
                className={"pagination-button " + (table.getCanPreviousPage() ? '' : 'disabled')}
                disabled={!table.getCanPreviousPage()}
                onClick={(e) => { setPageIndex(pageIndex - 1) }}
            >{"<"}
            </button>
            Page = {pageIndex + 1}/{table.getPageCount()}
            <button
                className={"pagination-button " + (table.getCanNextPage() ? '' : 'disabled')}
                disabled={!table.getCanNextPage()}
                onClick={(e) => { setPageIndex(pageIndex + 1) }}
            >{">"}
            </button>
        </div>
    </>)
}