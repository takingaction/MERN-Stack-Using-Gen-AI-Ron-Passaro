import { useState, useEffect, useRef } from "react";
import { uploadMaterial, getMaterialsByCourse, deleteMaterial } from "../service/materialService";
import { viewAllCourses } from "../service/courseService";
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";

function UploadMaterial() {
    let instructorEmail = sessionStorage.getItem("instructorEmail");
    let fileInputRef = useRef(null);
    let [courses, setCourses] = useState([]);
    let [selectedCourse, setSelectedCourse] = useState("");
    let [title, setTitle] = useState("");
    let [file, setFile] = useState(null);
    let [materials, setMaterials] = useState([]);
    let [message, setMessage] = useState("");
    let [loading, setLoading] = useState(false);
    let [showSuccessModal, setShowSuccessModal] = useState(false);
    let [deleteModalMaterial, setDeleteModalMaterial] = useState(null);
    let [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            loadMaterials(selectedCourse);
        }
    }, [selectedCourse]);

    let loadCourses = async () => {
        try {
            let result = await viewAllCourses();
            if (result.success) {
                let instructorCourses = result.data.filter(c => c.instructor === instructorEmail);
                setCourses(instructorCourses);
            }
        } catch (error) {
            console.error("Error loading courses:", error);
        }
    };

    let loadMaterials = async (courseId) => {
        try {
            let result = await getMaterialsByCourse(courseId);
            if (result.success) {
                setMaterials(result.data);
            }
        } catch (error) {
            console.error("Error loading materials:", error);
        }
    };

    let handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    let handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedCourse || !file) {
            setMessage("Please select a course and a file");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("courseId", selectedCourse);
            formData.append("title", title || file.name);
            formData.append("uploadedBy", instructorEmail);
            formData.append("file", file);

            let result = await uploadMaterial(formData);
            if (result.success) {
                setShowSuccessModal(true);
                setTitle("");
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                loadMaterials(selectedCourse);
                setMessage("");
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            console.error("Error uploading material:", error);
            setMessage(error.message);
        }
        setLoading(false);
    };

    let getFileIcon = (fileType) => {
        switch (fileType) {
            case "video": return "🎬";
            case "document": return "📄";
            case "presentation": return "📊";
            default: return "📁";
        }
    };

    let handleDeleteClick = (material) => {
        setDeleteModalMaterial(material);
    };

    let handleDeleteConfirm = async () => {
        if (!deleteModalMaterial) return;
        setIsDeleting(true);
        try {
            let result = await deleteMaterial(deleteModalMaterial._id, instructorEmail, "instructor");
            if (result.success) {
                setDeleteModalMaterial(null);
                loadMaterials(selectedCourse);
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            console.error("Error deleting material:", error);
            setMessage(error.message);
        }
        setIsDeleting(false);
    };

    return (
        <div className="course-card">
            <h3>Upload Course Materials</h3>
            <p className="small-note">Upload videos, documents, and presentations to your courses.</p>

            <form onSubmit={handleUpload} style={{ marginBottom: "2rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                    <label className="form-label">Select Course</label>
                    <select
                        className="input-field"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        required
                        style={{ width: "100%" }}
                    >
                        <option value="">-- Select a course --</option>
                        {courses.map(course => (
                            <option key={course._id} value={course._id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label className="form-label">Material Title (optional)</label>
                    <input
                        className="input-field"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Leave empty to use filename"
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label className="form-label">File</label>
                    <input
                        className="input-field"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        required
                        style={{ width: "100%" }}
                    />
                </div>

                {message && <p className="msg-error">{message}</p>}

                <button className="button" type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Upload Material"}
                </button>
            </form>

            {selectedCourse && materials.length > 0 && (
                <div>
                    <h4>Uploaded Materials</h4>
                    <div className="table-wrap">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Title</th>
                                    <th>Filename</th>
                                    <th>Size</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materials.map(material => (
                                    <tr key={material._id}>
                                        <td>{getFileIcon(material.fileType)}</td>
                                        <td>{material.title}</td>
                                        <td>{material.fileName}</td>
                                        <td>{(material.fileSize / 1024).toFixed(1)} KB</td>
                                        <td>
                                            <button
                                                className="button ghost small"
                                                onClick={() => handleDeleteClick(material)}
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <Modal
                isOpen={showSuccessModal}
                title="Success"
                onClose={() => setShowSuccessModal(false)}
            >
                Material uploaded successfully!
            </Modal>
            <ConfirmModal
                isOpen={!!deleteModalMaterial}
                title="Delete Material"
                message={`Are you sure you want to delete "${deleteModalMaterial?.title}"? This action cannot be undone.`}
                onClose={() => setDeleteModalMaterial(null)}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
            />
        </div>
    );
}

export default UploadMaterial;
