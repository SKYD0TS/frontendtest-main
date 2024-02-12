'use client'

type TableColumn = {
    title: string,
    name: string,
}

export default function Datatable(props: { columns: TableColumn[], data: any[] }) {
    const columns = props.columns
    const data = props.data
    return <table>
        <thead>
            <tr>
                {columns.map((v, n) => { return <td key={n}>{v.title}</td> })}
            </tr>
        </thead>
        <tbody>
            {data.map((d, dn) => {
                return <tr key={dn}>
                    {columns.map((c, cn) => { return <td key={dn}>{d[c.name]}</td> })}
                </tr>
            })}
        </tbody>
    </table>
}