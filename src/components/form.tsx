'use client'

import Input from "@/components/input"
import styles from "./form.module.css"
import { FormEvent } from "react"

type FormColumns = {
    model: string,
    name: string,
    type: string
}

async function HandleFormSubmit(e: FormEvent) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    console.log(formData)
    const req = await fetch('http://localhost:9009/api-test', {
        headers: { "Content-Type": "application/json" },
        method: 'post',
        body: JSON.stringify(Object.fromEntries(formData)),
    }).then((r) => { return r.json() })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
        });
}

export default function Form(props: { columns: FormColumns[] }) {

    return (<>
        <form className={styles.form} style={{ display: 'flex' }} onSubmit={HandleFormSubmit}>
            {props.columns.map((c, v) => {
                return <Input key={c.name} inputType={c} />
            })}
            <button type="submit">subm</button>
        </form>
    </>)
}