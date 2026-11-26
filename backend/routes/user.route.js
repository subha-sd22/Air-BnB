import express from "express"
import { getUser, getCurrentUser, updateUser, deleteUser } from "../controllers/user.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router()

router.get("/currentuser", verifyToken, getCurrentUser)
router.get("/:id", verifyToken, getUser)
router.post("/update/:id", verifyToken, updateUser)
router.delete("/delete/:id", verifyToken, deleteUser)

export default router
