import express from "express"
import { createBooking, deleteBooking } from "../controllers/booking.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"
const router = express.Router()
router.post("/create/:id", verifyToken, createBooking)
router.delete("/cancel/:id", verifyToken, deleteBooking)
export default router
