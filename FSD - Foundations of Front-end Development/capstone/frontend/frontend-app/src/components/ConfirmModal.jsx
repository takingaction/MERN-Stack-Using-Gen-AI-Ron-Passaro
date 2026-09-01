import Modal from "./Modal";

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel", isDeleting = false }) {
    let footer = (
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <button
                className="button ghost"
                onClick={onClose}
                disabled={isDeleting}
            >
                {cancelText}
            </button>
            <button
                className="button danger"
                onClick={onConfirm}
                disabled={isDeleting}
            >
                {isDeleting ? "Deleting..." : confirmText}
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="small"
            footer={footer}
        >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <span style={{ fontSize: "2rem", color: "#dc3545" }}>&#9888;</span>
                <p style={{ margin: 0 }}>{message}</p>
            </div>
        </Modal>
    );
}

export default ConfirmModal;
