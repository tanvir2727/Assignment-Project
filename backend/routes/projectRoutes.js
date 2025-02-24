const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { createProject, editProject, deleteProject, getOwnerProjects } = require('../controllers/projectController');

const router = express.Router();

// Create a new project
router.post('/projects',authenticate, createProject);

// Edit project (Only project owner can edit)
router.put('/projects/:projectId', authenticate, editProject);

// Delete project (Only project owner can delete)
router.delete('/projects/:projectId', authenticate, deleteProject);

router.get('/owner-projects', authenticate, getOwnerProjects);

module.exports = router;
