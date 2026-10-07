const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getOutgoingRequests,
  getIncomingRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest,
  declineRequest,
  approveRequest,
  cancelRequest,
  returnRequest,
} = require("../controllers/rentalRequestController");

const router = express.Router();

router.use(protect);

router.get("/outgoing", getOutgoingRequests);
router.get("/incoming", getIncomingRequests);

router.post("/", createRequest);
router.get("/:id", getRequestById);
router.patch("/:id", updateRequest);
router.delete("/:id", deleteRequest);

router.patch("/:id/approve", approveRequest);
router.patch("/:id/decline", declineRequest);
router.patch("/:id/cancel", cancelRequest);
router.patch("/:id/return", returnRequest);

module.exports = router;