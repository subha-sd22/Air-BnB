import express from "express"
import multer from "multer"
import { createListing, deleteListing, getAllListings, getListing, rateListing, searchListings, updateListing } from "../controllers/listing.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"

const upload = multer({ dest: "uploads/", limits: { fileSize: 5 * 1024 * 1024 } })
const images = upload.fields([{ name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 }, { name: "image3", maxCount: 1 }])
const router = express.Router()
router.get("/get", getAllListings)
router.get("/search", searchListings)
router.get("/findlistingByid/:id", getListing)
router.post("/add", verifyToken, images, createListing)
router.post("/update/:id", verifyToken, images, updateListing)
router.delete("/delete/:id", verifyToken, deleteListing)
router.post("/ratings/:id", verifyToken, rateListing)
export default router
