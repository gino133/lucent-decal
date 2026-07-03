const router = require('express').Router();
const { getAllProjects, getProjectBySlug, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const auth = require('../middleware/auth');

router.get('/', getAllProjects);
router.get('/:slug', getProjectBySlug);
router.post('/', auth, createProject);
router.put('/:slug', auth, updateProject);
router.delete('/:slug', auth, deleteProject);

module.exports = router;