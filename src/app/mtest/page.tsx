'use client'
import { Modal, ShowModalButton } from "@/components/modal";
import { RefObject, Usable, createRef, use, useEffect, useReducer, useRef, useState } from "react";

function add(modal: any) {
    modal.current?.setTitle('add')
    modal.current?.setBody('addBody')
    modal.current?.toggle()
}

function edit(modal: any) {
    modal.current?.setTitle('edit')
    modal.current?.setBody('editBody')
    modal.current?.toggle()
}

export default function page() {
    const modal = useRef(null)
    return <>
        <ShowModalButton modal={modal} modalMode={'popover'} onClick={add}>add</ShowModalButton>
        <ShowModalButton modal={modal} onClick={edit}>edit</ShowModalButton>

        <Modal ref={modal}>
            <h2>a</h2>
        </Modal>
    </>
}