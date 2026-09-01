import { useState, useEffect } from "react";
import { getMaterialsByCourse, downloadMaterial } from "../service/materialService";

function MaterialList({ courseId }) {
    let [materials, setMaterials] = useState([]);
    let [loading, setLoading] = useState(true);
    let [downloading, setDownloading] = useState(null);

    useEffect(() => {
        if (courseId) {
            loadMaterials();
        }
    }, [courseId]);

    let loadMaterials = async () => {
        setLoading(true);
        try {
            let result = await getMaterialsByCourse(courseId);
            if (result.success) {
                setMaterials(result.data);
            }
        } catch (error) {
            console.error("Error loading materials:", error);
        }
        setLoading(false);
    };

    let handleDownload = async (materialId, fileName) => {
        setDownloading(materialId);
        try {
            await downloadMaterial(materialId, fileName);
        } catch (error) {
            console.error("Error downloading:", error);
        }
        setDownloading(null);
    };

    let getFileIcon = (fileType) => {
        switch (fileType) {
            case "video": return "🎬";
            case "document": return "📄";
            case "presentation": return "📊";
            default: return "📁";
        }
    };

    let formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    if (loading) {
        return <p>Loading materials...</p>;
    }

    if (materials.length === 0) {
        return (
            <div style={{ padding: "1rem", textAlign: "center" }}>
                <p className="small-note">No materials uploaded for this course yet.</p>
            </div>
        );
    }

    return (
        <div className="materials-list">
            <h4>Course Materials</h4>
            <div className="table-wrap">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Size</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials.map(material => (
                            <tr key={material._id}>
                                <td>{getFileIcon(material.fileType)}</td>
                                <td>{material.title}</td>
                                <td style={{ textTransform: "capitalize" }}>{material.fileType}</td>
                                <td>{formatFileSize(material.fileSize)}</td>
                                <td>
                                    <button
                                        className="button"
                                        onClick={() => handleDownload(material._id, material.fileName)}
                                        disabled={downloading === material._id}
                                    >
                                        {downloading === material._id ? "Downloading..." : "Download"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MaterialList;
