
const express = require('express');
const router = express.Router();

router.use(require('./hoteles'));
router.use(require('./usuarios'));
router.use(require('./trabajadores'));
router.use(require('./estadisticas'));
router.use(require('./avisos'));

module.exports = router;