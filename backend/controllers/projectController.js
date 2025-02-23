const db = require('../config/db');

// 1. Create a new project
const createProject = async (req, res) => {
    try {
        const { name, introduction, status, startDateTime, endDateTime } = req.body;
        const ownerId = req.user.id; // The user creating the project becomes the owner

        if (!name || !introduction || !status || !startDateTime || !endDateTime) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const query = 'INSERT INTO projects (name, introduction, status, startDateTime, endDateTime, ownerId) VALUES (?, ?, ?, ?, ?, ?)';
        await db.query(query, [name, introduction, status, startDateTime, endDateTime, ownerId]);

        res.status(201).json({ message: 'Project created successfully' });
    } catch (error) {
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
        const [project] = await db.query(projectQuery, [projectId, ownerId]);

        if (project.length === 0) {
            return res.status(403).json({ message: 'You are not authorized to edit this project' });
        }

        const updateQuery = 'UPDATE projects SET name = ?, introduction = ?, status = ?, startDateTime = ?, endDateTime = ? WHERE id = ?';
        await db.query(updateQuery, [name, introduction, status, startDateTime, endDateTime, projectId]);

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
        const [project] = await db.query(projectQuery, [projectId, ownerId]);

        if (project.length === 0) {
            return res.status(403).json({ message: 'You are not authorized to delete this project' });
        }

        const deleteQuery = 'DELETE FROM projects WHERE id = ?';
        await db.query(deleteQuery, [projectId]);

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// 4. Assign user to project (Only project owner can assign)
const assignUserToProject = async (req, res) => {
    try {
        const { projectId, userId } = req.body;
        const ownerId = req.user.id;

        // Check if the project exists and the user is the owner
        const projectQuery = 'SELECT * FROM projects WHERE id = ? AND ownerId = ?';
        const [project] = await db.query(projectQuery, [projectId, ownerId]);

        if (project.length === 0) {
            return res.status(403).json({ message: 'You are not authorized to assign users to this project' });
        }

        // Add user to the project
        const assignQuery = 'INSERT INTO project_members (projectId, userId) VALUES (?, ?)';
        await db.query(assignQuery, [projectId, userId]);

        res.status(200).json({ message: 'User assigned to project successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { createProject, editProject, deleteProject, assignUserToProject };
