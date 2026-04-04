
const express = require('express')
const router = express.Router()

const documentController = require('../controllers/docementController');
const { isAuthenticated, authorizeRoles } = require('../middleware/Auth');


router.post('/createfolder',documentController.createfolder);

router.post('/upload/document', documentController.uploadDocument);

router.get('/get/documents',isAuthenticated,authorizeRoles('admin'), documentController.getAllDocuments);

router.get('/folders', documentController.getAllFolders);

router.get('/document/:id', documentController.getDocument);

router.delete('/document/:id', documentController.deleteDocument);

router.put('/document/:id', documentController.updateDocument);

router.post('/get/document', documentController.getFolderContents);

module.exports = router