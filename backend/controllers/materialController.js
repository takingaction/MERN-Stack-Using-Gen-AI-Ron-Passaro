const materialService = require("../services/materialService");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage(), limits: 50 * 1024 * 1024 });

const uploadMaterial = async (req, res) => {
    try {
        const { courseId, title, uploadedBy } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(200).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const material = await materialService.uploadMaterial(file, courseId, title, uploadedBy);
        res.status(201).json({
            success: true,
            data: material,
            message: "Material uploaded successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const getMaterialsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const materials = await materialService.getMaterialsByCourse(courseId);
        res.status(200).json({
            success: true,
            data: materials,
            message: "Materials retrieved successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const downloadMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const fileInfo = await materialService.getMaterialFile(id);

        res.set({
            "Content-Type": fileInfo.mimeType,
            "Content-Disposition": `attachment; filename="${fileInfo.fileName}"`,
            "Content-Length": fileInfo.fileSize
        });

        res.send(fileInfo.data);
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

const deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { requestingUser, userType } = req.body;
        const material = await materialService.deleteMaterial(id, requestingUser, userType);
        res.status(200).json({
            success: true,
            data: material,
            message: "Material deleted successfully"
        });
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    uploadMaterial,
    getMaterialsByCourse,
    downloadMaterial,
    deleteMaterial,
    upload
};
