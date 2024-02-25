'use client'
import { FC, ReactNode } from "react";

interface Functions {
    [key: string]: ((...args: any[]) => any);
}

interface Column {
    f: string, args: any[];
}

export function F({ columns, functions }: { columns: Column[], functions: Functions }) {
    console.log(columns)
    console.log(functions)

    // this works beautifully
    const the = () => columns.map((cv) => {
        try {
            if (!functions[cv.f] && !(typeof functions[cv.f] === 'function')) {
                throw new Error('no function of: ' + cv.f)
            }
            return functions[cv.f](...cv.args)
        } catch (err) {
            console.error(err)
        }
    }).reduce((pv, v) => pv + ' ' + v)
    return <h2>{the()}</h2>
    // return M <
}

export default function Page() {
    const functions = {
        identity: (value: any) => value,
        toUpperCase: (value: string) => value.toUpperCase(),
        concatenate: (str1: string, str2: string) => str1 + str2,
    }
    const columns = [
        { f: 'identity', args: ['just return'] },
        { f: 'toUpperCase', args: ['thistouppercase'] },
        { f: 'concatenate', args: ['conc', 'ate'] },
    ]

    return <F columns={columns} functions={functions} />
}


