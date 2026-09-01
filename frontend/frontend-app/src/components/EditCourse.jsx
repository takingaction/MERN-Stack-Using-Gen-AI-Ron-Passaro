import { useState, useEffect } from "react";
import { getCourseById, updateCourse } from "../service/courseService";

function EditCourse({ courseId, onSuccess, onCancel, requestingUser, userType }) {
    let [course, setCourse] = useState(null);
    let [title, setTitle] = useState("");
    let [description, setDescription] = useState("");
    let [duration, setDuration] = useState("");
    let [message, setMessage] = useState("");
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCourse();
    }, [courseId]);

    let loadCourse = async () => {
        try {
            let result = await getCourseById(courseId);
            if (result.success) {
                setCourse(result.data);
                setTitle(result.data.title);
                setDescription(result.data.description);
                setDuration(result.data.duration);
                setLoading(false);
            } else {
                setMessage(result.message);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error loading course:", error);
            setLoading(false);
        }
    };

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let updates = { title, description, duration: Number(duration) };
            let result = await updateCourse(courseId, updates, requestingUser, userType);
            if (result.success) {
                alert("Course updated successfully!");
                if (onSuccess) onSuccess();
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            console.error("Error updating course:", error);
            setMessage(error.message);
        }
    };

    if (loading) {
        return <p>Loading course...</p>;
    }

    return (
        <div className="course-card">
            <h3>Edit Course</h3>
            <p className="small-note">Update the course details below.</p>
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
                    <button className="button" type="submit">Update Course</button>
                    <button className="button ghost" type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default EditCourse;
