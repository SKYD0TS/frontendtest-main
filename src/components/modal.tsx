import { ReactNode, RefObject, useEffect } from "react"

interface ModalInterface {
    children:ReactNode,
    ref:RefObject<HTMLDialogElement>,

}

interface ShowModalButtonInterface {
    children:ReactNode,
    className:string,
}

interface ModalManagerInterface{
    modal: RefObject<HTMLDialogElement>,
    modalState:boolean
}

export function ModalManager(modal, modalState:ModalManagerInterface){
    useEffect(() => {
        const fm = modal.current as any
        if (modalState) {
          fm.showModal();
        } else {
          fm.close();
        }
      }, [modalState]);
}

export function ShowModalButton({children, className, }:ShowModalButtonInterface){
    return <button>{children}</button>
}

export function Modal({children, ref}:ModalInterface ){
    
      
    return <>
        <dialog ref={ref}>
            {children}
        </dialog>
    </>
}