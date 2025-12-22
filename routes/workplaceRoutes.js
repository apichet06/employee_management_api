const express = require("express");
const WorkplaceController = require("../controllers/workplaceController");

const router = express.Router();

router.get("/", WorkplaceController.getWorkplace);
router.post("/", WorkplaceController.createWorkplace);
router.put("/:wp_id", WorkplaceController.updateWorkplace);
router.delete("/:wp_id", WorkplaceController.deleteWorkplace);

module.exports = router
// module.exports = router;
