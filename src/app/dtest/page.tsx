'use client'

import { createElement, useState } from "react"

function returnFunction(elementFunctionName: string, elementFunctionArgs: Array<any>, handlers: Record<string, Function>, args: any) {
    console.log("returnFunction", { elementFunctionName, elementFunctionArgs, handlers, args })
    const functionArguments = elementFunctionArgs.map((a: any) => a)
    return () => { handlers[elementFunctionName](...functionArguments) }
    // return functionInFunction
}

function returnFunctionValue(elementFunctionName: string, elementFunctionArgs: Array<any>, handlers: Record<string, Function>, args: any) {
    console.log("returnFunctionValue", { elementFunctionName, elementFunctionArgs, handlers, args })
    const functionArguments = elementFunctionArgs.map((a: any) => a)
    const functionReturnValue = handlers[elementFunctionName](...functionArguments)
    return functionReturnValue
}

function createReactElement(elements: { type: string, props: any, children: any }, handlers?: Record<string, Function>, args?: any): any {
    console.log('===============')
    console.log('base elements', elements)

    if (elements.type === 'button' && elements.props.onClick && handlers) {
        elements.props.onClick = returnFunction(elements.props.onClick.function, elements.props.onClick.args, handlers, args)
        console.log('this is button', elements.props)
    }

    //?? ITERATE THROUGH CHILDREN
    if (Array.isArray(elements.children)) {
        console.error('ITERATE THROUGH CHILDREN?', elements)
        console.log('elements.children is ARRAY', elements.children)
        return elements.children.map((child, childN) => {
            console.log('child', child)
            if (Array.isArray(child.children)) {
                console.log(child)
                const childElements = createReactElement(child.children, handlers, args)
                const element = createElement(child.type, { ...child.props, key: childN }, childElements)
                return element
            }
            console.log('createReactElement', child.type, { ...child.props, key: childN }, child.children)
            return createReactElement({ type: child.type, props: { ...child.props, key: childN }, children: child.children }, handlers, args)
        })
    }

    //?? ITERATE THROUGH ELEMENTS
    if (Array.isArray(elements)) {
        console.log('elements is ARRAY', elements)
        return elements.map((element, elementN) => {
            console.log('element', element)
            if (Array.isArray(element.children)) {
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

export default function Page() {

    const functions: Record<string, Function> = {
        addWord: (word1: string, word2: string) => word1 + ' ' + word2,
        onClick: (word1: string, word2: string) => console.log({ word1 }, { word2 })
    }

    const [columns, setColumns] = useState([
        {
            accessorKey: "#",
            header: "#",
            className: 'AWHF',
            enableSorting: false,
            children: [
                {
                    type: 'button',
                    props: {
                        onClick: { function: 'onClick', args: ['header', 'className'] }
                    },
                    children: 'thisbutton',
                },
            ]
        },
        // {
        //     type: 'i',
        //     props: { className: 'classname' },
        //     children: [
        //         { function: 'addWord', args: ['header', 'className'] }
        //     ]
        // },
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