import { useState } from "react";
import { createCourse } from "../service/courseService";
import Modal from "./Modal";

function CreateCourseForm({ onSuccess, onCancel }) {
    let [title, setTitle] = useState("");
    let [description, setDescription] = useState("");
    let [instructor, setInstructor] = useState("");
    let [duration, setDuration] = useState("");
    let [message, setMessage] = useState("");
    let [showSuccessModal, setShowSuccessModal] = useState(false);

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let result = await createCourse({ title, description, instructor, duration: Number(duration) });
            if (result.success) {
                setShowSuccessModal(true);
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            console.error("Error creating course:", error);
            setMessage(error.message);
        }
    };

    let handleSuccessClose = () => {
        setShowSuccessModal(false);
        setTitle("");
        setDescription("");
        setInstructor("");
        setDuration("");
        if (onSuccess) onSuccess();
    };

    return (
        <div className="course-card">
            <h3>Create New Course</h3>
            <p className="small-note">Fill in the details to create a new course.</p>
            {message && <p className="msg-error">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                    <label className="form-label">Title</label>
                    <input
                        className="input-field"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: "100%" }}
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label className="form-label">Description</label>
                    <textarea
                        className="input-field"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows="4"
                        style={{ width: "100%" }}
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label className="form-label">Instructor Email</label>
                    <input
                        className="input-field"
                        type="email"
                        value={instructor}
                        onChange={(e) => setInstructor(e.target.value)}
                        required
                        style={{ width: "100%" }}
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label className="form-label">Duration (hours)</label>
                    <input
                        className="input-field"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                        min="1"
                        style={{ width: "100%" }}
                    />
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="button" type="submit">Create Course</button>
                    <button className="button ghost" type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>

            <Modal
                isOpen={showSuccessModal}
                onClose={handleSuccessClose}
                title="Success"
                size="small"
                footer={
                    <button className="button success" onClick={handleSuccessClose}>
                        OK
                    </button>
                }
            >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontSize: "2rem", color: "#28a745" }}>&#10003;</span>
                    <p style={{ margin: 0 }}>Course created successfully!</p>
                </div>
            </Modal>
        </div>
    );
}

export default CreateCourseForm;
