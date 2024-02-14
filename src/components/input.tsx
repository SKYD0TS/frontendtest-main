'use client'
import style from './input.module.css'

type InputType = {
    type: string,
    model: string,
    name: string,
}

type InputModel = {
    [key: string]: JSX.Element
}
export default function Input(param: { inputType: InputType }) {
    const inputModel: InputModel = {
        text: <input className={`${style.input} ${style.text}`} name={param.inputType.name} />,
        number: <input className={`${style.input} ${style.number}`} name={param.inputType.name} />
    }

    return inputModel[param.inputType.model]
}