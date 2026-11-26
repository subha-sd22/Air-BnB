import Listing from "../models/listing.model.js"

const fileUrl = (req, file) => file ? `${req.protocol}://${req.get("host")}/uploads/${file.filename}` : undefined

const listingPayload = (req, current = {}) => ({
    title: req.body.title ?? current.title,
    description: req.body.description ?? current.description,
    rent: req.body.rent ?? current.rent,
    city: req.body.city ?? current.city,
    landMark: req.body.landMark ?? current.landMark,
    category: req.body.category ?? current.category,
    image1: fileUrl(req, req.files?.image1?.[0]) ?? current.image1,
    image2: fileUrl(req, req.files?.image2?.[0]) ?? current.image2,
    image3: fileUrl(req, req.files?.image3?.[0]) ?? current.image3,
})

export const createListing = async (req, res) => {
    try {
        const listing = new Listing({ ...listingPayload(req), host: req.user.id })
        await listing.save()
        res.status(201).json(listing)
    } catch (error) { res.status(500).json({ message: error.message }) }
}

export const getListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
        if (!listing) return res.status(404).json({ message: "Listing not found" })
        res.status(200).json(listing)
    } catch (error) { res.status(500).json({ message: error.message }) }
}

export const getAllListings = async (_req, res) => {
    try { res.status(200).json(await Listing.find().sort({ createdAt: -1 })) }
    catch (error) { res.status(500).json({ message: error.message }) }
}

export const searchListings = async (req, res) => {
    try {
        const query = (req.query.query || "").trim()
        if (!query) return res.status(200).json([])
        const expression = new RegExp(query, "i")
        res.status(200).json(await Listing.find({ $or: [{ title: expression }, { city: expression }, { landMark: expression }] }).limit(20))
    } catch (error) { res.status(500).json({ message: error.message }) }
}

export const updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
        if (!listing) return res.status(404).json({ message: "Listing not found" })
        if (listing.host.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" })
        Object.assign(listing, listingPayload(req, listing))
        await listing.save()
        res.status(200).json(listing)
    } catch (error) { res.status(500).json({ message: error.message }) }
}

export const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
        if (!listing) return res.status(404).json({ message: "Listing not found" })
        if (listing.host.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" })
        await listing.deleteOne()
        res.status(200).json({ message: "Listing deleted successfully" })
    } catch (error) { res.status(500).json({ message: error.message }) }
}

export const rateListing = async (req, res) => {
    try {
        const rating = Number(req.body.ratings)
        if (!Number.isFinite(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: "Rating must be between 1 and 5" })
        const listing = await Listing.findByIdAndUpdate(req.params.id, { ratings: rating }, { new: true })
        if (!listing) return res.status(404).json({ message: "Listing not found" })
        res.status(200).json(listing)
    } catch (error) { res.status(500).json({ message: error.message }) }
}
