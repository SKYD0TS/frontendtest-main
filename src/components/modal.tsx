import { effect, signal } from "@preact/signals"
import { Dispatch, MutableRefObject, ReactNode, RefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import style from './modal.module.css'

interface ShowModalButtonInterface {
    children?: ReactNode | string,
    className?: string,
    modal: RefObject<HTMLDialogElement>,
    modalMode?: 'popover' | 'modal',
    onClick?: (...args: any) => void
}

export function ShowModalButton({ modal, modalMode, children, className, onClick }: ShowModalButtonInterface) {
    function handleClick() {
        if (onClick) {
            onClick(modal)
        }
        switch (modalMode ?? 'modal') {
            case 'popover':
                modal.current?.show()
                break
            case 'modal':
                modal.current?.showModal()
                break
        }
        console.log(modal.current)
    }
    return <button onClick={() => onClick ? onClick(modal) : handleClick()}>{children}</button>
}

export const Modal = forwardRef(ModalF)

function ModalF(props: any, ref: any) {
    const dialog = useRef<HTMLDialogElement>(null)
    type children = ReactNode | string
    interface ModalProps {
        title: children,
        body: children,
        dismissButtonTitle: children
    }
    const [modalProps, setModalProps] = useState({ title: '', body: '', dismissButtonTitle: 'Close' } as ModalProps)

    useImperativeHandle(ref, () => {
        return {
            setTitle(title: string) {
                setModalProps(prev => ({ ...prev, title: title }))
                console.log({ ...modalProps, title: title })
            },
            setBody(children: ReactNode | string) {
                setModalProps(prev => ({ ...prev, body: children }))
                console.log({ ...modalProps, body: children })
            },
            show(type?: 'popover' | 'modal') {
                switch (type ?? 'modal') {
                    case 'popover': dialog.current?.show()
                        break
                    case 'modal': dialog.current?.showModal()
                        break
                }
            },
            hide() {
                dialog.current?.close()
            },
            toggle(type: 'popover' | 'modal') {
                dialog.current?.open ? this.hide() : this.show(type ?? 'modal')
            },

        }
    })
    return <>
        <dialog className={style.dialog} ref={dialog}>
            <div className={style.dialog_title}><h3>{modalProps.title}</h3>
                <CloseModalButton dialog={dialog}>{modalProps.dismissButtonTitle}</CloseModalButton>
            </div>
            <div className={style.dialog_body}>
                {modalProps.body}
            </div>
        </dialog>
    </>
}

function CloseModalButton({ dialog, children }: { children?: ReactNode | string, dialog: RefObject<HTMLDialogElement> }) {
    return <button onClick={() => dialog.current?.close()}>{children}</button>
}