'use client'
import {Modal, ShowModalButton, ModalManager} from "@/components/modal";
import { useRef, useState } from "react";

export default function page(){
    
    const modal = useRef<HTMLDialogElement>(null)
    const [modalState, setModalState] = useState(false)
    ModalManager(modal, modalState)
    return <>
    <Modal ref={modal}>
        <h2>a</h2>
    </Modal>
    </>
}