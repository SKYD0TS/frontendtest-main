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
    isFunction,
    HeaderContext,
    getFilteredRowModel,
    ColumnFiltersState
} from "@tanstack/react-table";
import { ReactNode, useEffect, useState } from "react";
import style from './datatable.module.css'

// export function SortableHeader(props: { column: any }) {
//     <button>{props.column.columnDef.accessorKey}</button>
// }

export default function Datatable(props: { data: any[], columns: ColumnDef<any>[] }) {
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        columns: props.columns,
        data: props.data,
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
    // const table = useReactTable({columns, data})
    // table.getState().rowSelection //read the row selection state
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
                {table.getRowModel().rows.map(data => {
                    return <tr key={data.id}>{data.getVisibleCells().map((c) => {
                        return <td key={c.id}>{
                            flexRender(
                                c.column.columnDef.cell,
                                c.getContext()
                            )
                        }</td>
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