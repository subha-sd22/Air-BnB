import Booking from "../models/booking.model.js"
import Listing from "../models/listing.model.js"

export const createBooking = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate("host", "email name")
        if (!listing) return res.status(404).json({ message: "Listing not found" })
        if (listing.host._id.toString() === req.user.id) return res.status(400).json({ message: "You cannot book your own listing" })
        const booking = await Booking.create({ listing: listing._id, user: req.user.id, checkIn: req.body.checkIn, checkOut: req.body.checkOut, totalRent: req.body.totalRent })
        listing.isBooked = true
        await listing.save()
        res.status(201).json({ ...booking.toObject(), host: listing.host })
    } catch (error) { res.status(500).json({ message: error.message }) }
}

export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
        if (!booking) return res.status(404).json({ message: "Booking not found" })
        if (booking.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" })
        await Listing.findByIdAndUpdate(booking.listing, { isBooked: false })
        await booking.deleteOne()
        res.status(200).json({ message: "Booking cancelled successfully" })
    } catch (error) { res.status(500).json({ message: error.message }) }
}
