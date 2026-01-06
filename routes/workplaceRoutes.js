const express = require("express");
const WorkplaceController = require("../controllers/workplaceController");
const Auth = require("../middleware/auth");

const router = express.Router();

router.get("/", Auth.authenticateToken, WorkplaceController.getWorkplace);
router.post("/", Auth.authenticateToken, WorkplaceController.createWorkplace);
router.put("/:wp_id", Auth.authenticateToken, WorkplaceController.updateWorkplace);
router.delete("/:wp_id", Auth.authenticateToken, WorkplaceController.deleteWorkplace);

module.exports = router
// module.exports = router;
