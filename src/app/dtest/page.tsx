'use client'

import { createElement, useState } from "react"

function insertFunction(elementFunctionName: string, elementFunctionArgs: Array<any>, handlers: Record<string, Function>, args: any) {
    console.log("insertFunction", { elementFunctionName, elementFunctionArgs, handlers, args })
    const functionArguments = elementFunctionArgs.map((a: any) => a)
    const functionReturnValue = handlers[elementFunctionName](...functionArguments)
    return functionReturnValue
}

function createReactElement(elements: { type: string, props: any, children: any }, handlers?: Record<string, Function>, args?: any): any {
    console.log('elements', elements)

    if (Array.isArray(elements)) {
        console.log('elements is ARRAY', elements)
        return elements.map((element, elementN) => {
            console.log(element)
            if (element.function && handlers && args) {
                const functionReturnValue = insertFunction(element.function, element.args, handlers, args)
                console.log(functionReturnValue)
                return functionReturnValue
            } else {
                const ce = createElement(element.type, { ...element.props, key: elementN }, element.children)
                return ce
            }
        })
    }

    if (Array.isArray(elements.children)) {
        return elements.children.map((child, childN) => {
            console.log('child', child)
            if (Array.isArray(child.children)) {
                console.log(child.children)
                const childCRE = createReactElement(child.children, handlers, args)
                const parent = createElement(child.type, { ...child.props, key: childN }, childCRE)
                console.log('parent', parent)
                console.log('childCRE', childCRE)
                return parent
            }
            return createReactElement({ ...child, props: { key: childN } }, handlers, args)
        })
    }
    console.log('elements.children NOT ARRAY', elements)
    if (typeof elements.children === 'string') {
        const ce = createElement(elements.type, elements.props, elements.children)
        console.log("createElement === STRING", ce)
        return ce
    } else if (typeof elements.children === 'object') {
        const ce = createElement(elements.children, elements.props, elements.children)
        console.log("createElement === OBJECT", ce)
        return ce
    }
    // else if (elements.children.function) {
    //     console.log()
    //     return null
    // } 
}
// else if (Array.isArray(e.children)) {
//     console.log('e.children', e.children)
//     return e.children.map((child: any, childN: number) => {
//         console.log('e', e)
//         if (child.function && handlers) {
//             const functionArguments = child.args.map((a: any) => a)
//             const elementChild = handlers[child.function](...functionArguments)
//             return createElement(e.type, { ...e.props, key: childN }, elementChild)
//         } else if (child.type) {
//             console.log('this shall be element', child)
//             return createElement(e.type, { ...e.props, key: childN },)
//         }
//     })

// }


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
            children: [
                {
                    type: 'i',
                    props: { className: 'classname' },
                    children: 'this be i',
                },
                { function: 'addWord', args: ['header', 'className'] }
                // {
                //     type: 'h2',
                //     props: { className: 'classname' },
                //     children: [{
                //         type: 'i',
                //         props: { className: 'classname' },
                //         children: 'this be ih3',
                //     }],
                // },
                // {
                //     type: 'h3',
                //     props: { className: 'classname' },
                //     children: [{ function: 'addWord', args: ['header', 'className'] }],
                // },
                // {
                //     type: 'div',
                //     props: { className: 'classname', style: { display: "flex" } },
                //     children: [{
                //         type: 'button',
                //         props: { className: 'classname' },
                //         children: 'this be button',
                //     }]
                // },
            ]
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
                return <div key={n}>{createReactElement(column as any, functions, { ...column })}</div>
            }
            <p key={n}>{column.accessorKey}aaaaa</p>
        })}
    </>
}