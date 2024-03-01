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
    ColumnFiltersState,
    Table
} from "@tanstack/react-table"
import { ReactNode, createElement, useEffect, useState } from "react"
import style from './datatable.module.css'

export function DatatableHeader({ table }: { table: Table<unknown> }) {
    return table.getHeaderGroups().map((hg) =>
        <tr key={hg.id}>
            {hg.headers.map((h) => {
                return <th key={h.id}>{
                    h.column.getCanSort() ?
                        <button
                            onClick={(e) => { h.column.toggleSorting(h.column.getIsSorted() === "asc") }}
                            className={style.ghostButton} key={h.id}>{(h.column.columnDef.header ?? "-") as string}</button>
                        :
                        flexRender(h.column.columnDef.header, h.getContext())
                }</th>
            })}
        </tr>
    )
}

function index(absoluteRowPosition: any, pageSize: any, pageIndex: any) {
    return (absoluteRowPosition + 1) + (pageSize * pageIndex)
}

function returnFunction(elementFunctionName: string, elementFunctionArgs: Array<any>, handlers: Record<string, Function>, args: any) {
    console.log("returnFunction", { elementFunctionName, elementFunctionArgs, handlers, args })
    const functionArguments = elementFunctionArgs.map((a: any) => args[a])
    return () => { handlers[elementFunctionName](...functionArguments) }
}

function returnFunctionValue(elementFunctionName: string, elementFunctionArgs: Array<any>, handlers: Record<string, Function>, args: any) {
    const functionArguments = elementFunctionArgs.map((a: any) => args[a])
    const functionReturnValue = handlers[elementFunctionName](...functionArguments)
    console.log(functionArguments)
    return functionReturnValue
}

function createReactElement(elements: { type: string, props: any, children: any }, handlers?: Record<string, Function>, args?: any): any {
    console.log('===============')
    console.log('base elements', elements)

    if (elements.type === 'button' && elements.props.onClick.function && elements.props.onClick.args && handlers) {
        console.log('this is button', elements.props)
        elements.props.onClick = returnFunction(elements.props.onClick.function, elements.props.onClick.args, handlers, args)
    }


    //?? ITERATE THROUGH ELEMENTS
    if (Array.isArray(elements)) {
        console.log('elements is ARRAY', elements)
        return elements.map((element, elementN) => {
            console.log('element', element)
            if (element.type === 'button' && element.props.onClick.function && element.props.onClick.args && handlers) {
                console.log('this is button', element.props)
                element.props.onClick = returnFunction(element.props.onClick.function, element.props.onClick.args, handlers, args)
            }
            if (typeof element === 'string') {
                return element
            } else if (Array.isArray(element.children)) {
                console.log('element.children', element.children)
                const elementObject = { type: element.type, props: { ...element.props, key: elementN }, children: element.children }
                const elementChild = createReactElement(elementObject, handlers, args)
                return createElement(element.type, { ...element.props, key: elementN }, elementChild)
            } else if (element.function && handlers && args) {
                const functionReturnValue = returnFunctionValue(element.function, element.args, handlers, args)
                return functionReturnValue
            }
            console.log('element.child is NOT ARRAY/FUNCTION')
            return createElement(element.type, { key: elementN, ...element.props }, element.children)
        })
    }


    //?? ITERATE THROUGH CHILDREN
    if (elements.children && Array.isArray(elements.children)) {
        console.error('ITERATE THROUGH CHILDREN?', elements)
        console.log('elements.children is ARRAY', elements.children)
        return elements.children.map((child, childN) => {
            console.log('child', child)
            if (typeof child === 'string') {
                return child
            } else if (Array.isArray(child.children)) {
                console.log(child)
                const childElements = createReactElement(child.children, handlers, args)
                const element = createElement(child.type, { ...child.props, key: childN }, childElements)
                return element
            } else if (child.function && handlers && args) {
                const functionReturnValue = returnFunctionValue(child.function, child.args, handlers, args)
                return functionReturnValue
            }
            console.log('createReactElement', child.type, { ...child.props, key: childN }, child.children)
            return createReactElement({ type: child.type, props: { ...child.props, key: childN }, children: child.children }, handlers, args)
        })
    }


    console.log('elements.children NOT ARRAY', elements)
    // ??CHECK IF ELEMENT HAVE CHILDREN
    if (elements.children) {
        // ?? return children of type string
        if (typeof elements.children === 'string') {
            const ce = createElement(elements.type, elements.props, elements.children)
            console.log("createElement === STRING", ce)
            return ce
        } else if (typeof elements.children === 'object') {
            const ce = createElement(elements.children, elements.props, elements.children)
            console.log("createElement === OBJECT", ce)
            return ce
        }
    } else {
        console.log('elements has no children', elements)
        const element = elements as any
        if (element.function && handlers && args) {
            console.log("ELEMENTS IS FUNCTION", element.function, element.args)
            const functionReturnValue = returnFunctionValue(element.function, element.args, handlers, args)
            return functionReturnValue
        }
        console.log('elements has no child and is not a function, how?')
        return createElement(elements.type, elements.props)
    }
}


export default function Datatable(props: { data: any[], columns: ColumnDef<any>[], apiUrl: string, handlers?: Record<string, Function> }) {

    const [columns, setColumns] = useState<any>(props.columns)
    const [data, setData] = useState<any>(props.data)

    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const builtinFunctions = {
        index: index,
    }

    const handlers = { ...builtinFunctions, ...props.handlers }
    console.log(handlers)

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

    return (<>
        {/* {console.time('create-element')} */}
        <div>
            <label htmlFor="search">Search:</label>
            <input
                onChange={(e) => { table.setGlobalFilter(e.target.value) }}
                id="search"
                type="text" />
        </div>
        <table className={style.datatable}>
            <thead>
                <DatatableHeader table={table} />
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
                        return <td key={c.id}>
                            {args.columnDef.children ? createReactElement(args.columnDef.children, handlers, args)
                                : flexRender(c.column.columnDef.cell, c.getContext())}
                        </td>
                    })}
                    </tr>
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
        {/* {console.timeEnd('create-element')} */}
    </>)
}