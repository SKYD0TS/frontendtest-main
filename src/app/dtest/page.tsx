'use client'

import { createElement, useState } from "react"


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
            } else if (Array.isArray(e.children)) {
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



export default function Page() {

    const functions: Record<string, Function> = {
        addWord: (word1: string, word2: string) => word1 + ' ' + word2
    }

    const [columns, setColumns] = useState([
        {
            accessorKey: "#",
            header: "#",
            className: 'AWHF',
            enableSorting: false,
            children: [{
                type: 'h3',
                props: { className: 'classname' },
                children: { function: 'addWord', args: ['header', 'className'] },
            }, {
                type: 'div',
                props: { className: 'classname', style: { display: "flex" } },
                children: [{
                    type: 'button',
                    props: { className: 'classname' },
                    children: 'this be button',
                }, {
                    type: 'h3',
                    props: { className: 'classname' },
                    children: 'this be h3',
                }],
            }]
            // { function: { name: 'index', args: ['absoluteRowPosition', 'pageSize', 'pageIndex'] } }
        },
        // {
        //     accessorKey: "username",
        //     header: "Username",
        // },
    ])



    return <>
        <h1>aw</h1>
        {createElement('h2', null, 'h2string')}
        <hr />
        <br />
        <hr />
        {columns.map((column, n) => {
            if (column.children) {
                return <div key={n}>{createReactElement(column.children as any, functions, { ...column })}</div>
            }
            <p key={n}>{column.accessorKey}aa</p>
        })}
    </>
}