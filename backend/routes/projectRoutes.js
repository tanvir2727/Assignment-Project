const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { createProject, editProject, deleteProject, assignUserToProject } = require('../controllers/projectController');

const router = express.Router();

// Create a new project
router.post('/projects', authenticate, createProject);

// Edit project (Only project owner can edit)
router.put('/projects/:projectId', authenticate, editProject);

// Delete project (Only project owner can delete)
router.delete('/projects/:projectId', authenticate, deleteProject);

// Assign user to a project (Only project owner can assign)
router.post('/projects/assign', authenticate, assignUserToProject);

module.exports = router;
