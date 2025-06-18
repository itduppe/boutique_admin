import { useState } from "react";

export const useMultiModal = () => {
    const [modalType, setModalType] = useState<null | "add" | "update" | "changePass">(null);

    const openModal = (type: "add" | "update" | "changePass") => setModalType(type);
    const closeModal = () => setModalType(null);

    return {
        isOpen: modalType !== null,
        modalType,
        openModal,
        closeModal,
    };
};