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


// !!NO TYPE
function createReactElement({ type, props, children }: any) {
    const childElements: Array<any> = Array.isArray(children)
        ? children.map(child =>
            typeof child === 'object' ? createReactElement(child) : child
        )
        : [children];
    return createElement(type, { ...props, className: style[props?.className ?? type] }, ...childElements);
}

export default function Datatable(props: { data: any[], columns: ColumnDef<any>[], apiUrl: string, handlers?: any }) {

    const [columns, setColumns] = useState<any>(props.columns)
    const [data, setData] = useState<any>(props.data)

    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

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
    return createReactElement({
        type: 'div',
        props: { className: 'container' },
        children: [
            { type: "button", props: { onClick: 'handleEdit' }, children: "edit" },
            { type: 'i', props: { className: 'icon-1' }, children: null },
            'this is a string',
            {
                type: 'div',
                props: { className: 'nested-container' },
                children: [
                    'Nested content',
                    {
                        type: 'p',
                        props: null,
                        children: ['More nested content']
                    }
                ]
            }
        ]
    })
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

                        if (columnDef.columnTemplate?.template == "index") {
                            return <td key={c.id}>{(dn + 1) + (pageSize * pageIndex)}</td>
                        }
                        else if (columnDef.columnTemplate?.template == "action") {
                            return <td key={c.id}>
                                {columnDef.columnTemplate.templateProps.children.map((p: any, pn: number) => {
                                    if (p.type == 'button') {
                                        // return createElement(p.type, { p.props })

                                        return <button key={pn}
                                            onClick={() => { eval(`${p.onClick}(${originalData.id})`) }}
                                        >{p.text}</button>
                                    }
                                })}
                            </td>
                        }
                        else {
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
        </table>
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