const express = require('express');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const ctrl = require('./book.controller');

const router = express.Router();

router.use(auth);

// User & admin
router.get('/', ctrl.list);
router.get('/:bookId/details', ctrl.listDetails);
router.get('/details/:detailId', ctrl.getDetail); // guarded + logs access

// Admin CRUD
router.post('/', role('admin'), ctrl.create);
router.put('/:id', role('admin'), ctrl.update);
router.delete('/:id', role('admin'), ctrl.remove);

router.post('/details/', role('admin'), ctrl.createDetail);
router.put('/details/:id', role('admin'), ctrl.updateDetail);
router.delete('/details/:id', role('admin'), ctrl.removeDetail);


module.exports = router;

// ===================== TIERS & ACCESS =====================
