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

// !!NO TYPE
function createReactElement(elements: { type: string, props: any, children: any }, handlers?: Record<string, Function>, args?: any): any {
    console.log('elements', elements)

    if (Array.isArray(elements)) {
        return elements.map((e, en) => {
            if (e.children.function && handlers) {
                console.group('e.children has FUNCTION')
                console.log('e', e)
                console.log('e.children.function', e.children.function)
                console.log('e.children.function', e.children.args)
                console.log('handlers', handlers)
                console.log('args', args)
                let functionArgument: any = [];
                e.children.args.forEach((key: any) => {
                    functionArgument = [...functionArgument, args[key]];
                });
                console.log('function', handlers[e.children.function])
                console.log('functionArgument', functionArgument)
                console.log('function(functionArgument)', handlers[e.children.function](...functionArgument))
                console.groupEnd()
                return createElement(e.type, { ...e.props, key: en }, handlers[e.children.function](...functionArgument))

            } else if (typeof e.children === 'string') {
                // console.group('e.children is STRING')
                // console.log(e.children)
                // console.log(e)
                // console.groupEnd()
                return createElement(e.type, { ...e.props, key: en }, e.children)
            }
            else if (Array.isArray(e.children)) {
                // console.group('e.children is ARRAY')
                // console.log("e.children", e.children)
                // console.log("e", e)
                // console.log('createReactElement', createReactElement(e.children))
                // console.log('ret', { ...e, children: createReactElement(e.children) })
                // console.groupEnd()
                return createElement(e.type, { ...e.props, key: en }, createReactElement(e.children))
            }
        })
    }
}

export default function Datatable(props: { data: any[], columns: ColumnDef<any>[], apiUrl: string, handlers?: Record<string, Function> }) {

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

    // return <>{createReactElement({
    //     type: 'p',
    //     props: null,
    //     children: { function: { name: 'index', args: ['absoluteRowPosition'] } }
    // }, props.handlers,)}</>
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
                        const args = {
                            absoluteRowPosition: dn,
                            columnDef: c.column.columnDef as any,
                            originalData: c.row.original as any,
                            pageSize: pageSize,
                            pageIndex: pageIndex,
                        }

                        console.log('args.columnDef.children', args.columnDef.children)
                        return args.columnDef.children ? createReactElement(args.columnDef.children, props.handlers, args)
                            : ''
                        // const element = args.columnDef.children ?
                        //     createReactElement(args.columnDef, handlers, args)
                        //     : args.originalData;

                        // console.log(args['columnDef' as keyof typeof args])
                        // return createReactElement(args.columnDef)
                        return <td key={c.id}>{ }</td>
                        {/* {(dn + 1) + (pageSize * pageIndex)} */ }
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