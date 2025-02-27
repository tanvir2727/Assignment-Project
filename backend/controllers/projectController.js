const db = require('../confige/db');
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

// 1. Create a new project
const createProject = async (req, res) => {
    try {
        
        if (!req.user) {
            return res.status(403).json({ message: 'User not authenticated' });
        }

        const { name, introduction, status, startDateTime, endDateTime, members } = req.body;
        const ownerId = req.user.id;

        if (!name || !introduction || !status || !startDateTime || !endDateTime) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!Array.isArray(members) || members.length > 5) {
            return res.status(400).json({ message: 'You can assign up to 5 members only' });
        }

        const projectQuery = 'INSERT INTO projects (name, introduction, status, startDateTime, endDateTime, ownerId) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.promise().query(projectQuery, [name, introduction, status, startDateTime, endDateTime, ownerId]);

        const projectId = result.insertId;

        if (members.length > 0) {
            // Validate that all users exist
            const checkUsersQuery = 'SELECT id FROM users WHERE id IN (?)';
            const [validUsers] = await db.promise().query(checkUsersQuery, [members]);

            const validUserIds = validUsers.map(user => user.id);
            const invalidUserIds = members.filter(id => !validUserIds.includes(id));

            if (invalidUserIds.length > 0) {
                return res.status(400).json({ message: `Users not found: ${invalidUserIds.join(', ')}` });
            }

            // Insert only valid users
            const memberQuery = 'INSERT INTO project_members (projectId, userId) VALUES ?';
            const memberValues = validUserIds.map(userId => [projectId, userId]);
            await db.promise().query(memberQuery, [memberValues]);
        }

        res.status(201).json({ message: 'Project created and members assigned successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
};



// 2. Edit project (Only project owner can edit)
const editProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, introduction, status, startDateTime, endDateTime } = req.body;
        const ownerId = req.user.id;

        // Check if the project exists and the user is the owner
        const projectQuery = 'SELECT * FROM projects WHERE id = ? AND ownerId = ?';
        const [project] = await db.promise().query(projectQuery, [projectId, ownerId]);

        if (project.length === 0) {
            return res.status(403).json({ message: 'You are not authorized to edit this project' });
        }

        const updateQuery = 'UPDATE projects SET name = ?, introduction = ?, status = ?, startDateTime = ?, endDateTime = ? WHERE id = ?';
        await db.promise().query(updateQuery, [name, introduction, status, startDateTime, endDateTime, projectId]);

        res.status(200).json({ message: 'Project updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// 3. Delete project (Only project owner can delete)
const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const ownerId = req.user.id;

        // Check if the project exists and the user is the owner
        const projectQuery = 'SELECT * FROM projects WHERE id = ? AND ownerId = ?';
        const [project] = await db.promise().query(projectQuery, [projectId, ownerId]);

        if (project.length === 0) {
            return res.status(403).json({ message: 'You are not authorized to delete this project' });
        }

        const deleteQuery = 'DELETE FROM projects WHERE id = ?';
        await db.promise().query(deleteQuery, [projectId]);

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


const getOwnerProjects = async (req, res) => {
    try {
        const ownerId = req.user.id; // Get user ID from authenticated request

        const query = 'SELECT * FROM projects WHERE ownerId = ?';
        const [projects] = await db.promise().query(query, [ownerId]);

        if (projects.length === 0) {
            return res.status(404).json({ message: 'No projects found' });
        }

        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const getProjects = async (req, res) => {
    try {
        const projectsQuery = `
            SELECT p.id, p.name, p.introduction, p.status, p.startDateTime, p.endDateTime, p.ownerId, u.name AS ownerName
            FROM projects p
            JOIN users u ON p.ownerId = u.id`;
        
        const [projects] = await db.promise().query(projectsQuery);
        
        for (let project of projects) {
            const membersQuery = `
                SELECT u.id, u.name, u.email
                FROM project_members pm
                JOIN users u ON pm.userId = u.id
                WHERE pm.projectId = ?`;
            
            const [members] = await db.promise().query(membersQuery, [project.id]);
            project.members = members;
        }
        
        res.status(200).json({ projects });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
};



const generatePdf = async (req, res) => {
    try {
        // Fetch all projects from the database
        const [projects] = await db.promise().query(
            "SELECT p.name, p.introduction, p.status, u.name AS ownerName FROM projects p JOIN users u ON p.ownerId = u.id"
        );

        if (!projects.length) {
            return res.status(404).json({ error: "No projects found" });
        }

        // Ensure the 'reports' directory exists
        const reportsDir = path.join(__dirname, "../public/reports");
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        // Define file path
        const filePath = path.join(reportsDir, "all_projects.pdf");

        // Create PDF document
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // PDF Title
        doc.fontSize(18).text("Project Report", { align: "center" }).moveDown();

        // Table Headers
        doc.fontSize(12).text("Project Name", 50, doc.y, { width: 150 });
        doc.text("Introduction", 200, doc.y, { width: 200 });
        doc.text("Status", 400, doc.y, { width: 80 });
        doc.text("Owner", 500, doc.y, { width: 150 });
        doc.moveDown();

        // Table Content
        projects.forEach((project) => {
            doc.fontSize(10).text(project.name, 50, doc.y, { width: 150 });
            doc.text(project.introduction, 200, doc.y, { width: 200 });
            doc.text(project.status, 400, doc.y, { width: 80 });
            doc.text(project.ownerName, 500, doc.y, { width: 150 });
            doc.moveDown();
        });

        // Finish PDF
        doc.end();

        // Wait until the file is fully written before sending response
        stream.on("close", () => {
            res.download(filePath);
        });

    } catch (error) {
        console.error("PDF Generation Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




module.exports = { createProject,
        editProject,
        deleteProject,
        getOwnerProjects,
        getProjects,
        generatePdf };
