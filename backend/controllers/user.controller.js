import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ message: "User not found" })
        const { password, ...rest } = user._doc
        res.status(200).json(rest)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        if (!user) return res.status(404).json({ message: "User not found" })
        const Listing = (await import("../models/listing.model.js")).default
        const Booking = (await import("../models/booking.model.js")).default
        const listing = await Listing.find({ host: user._id })
        const booking = await Booking.find({ user: user._id }).populate("listing")
        res.status(200).json({ ...user.toObject(), listing, booking: booking.map((item) => item.listing).filter(Boolean) })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateUser = async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true })
        const { password, ...rest } = updatedUser._doc
        res.status(200).json(rest)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie("access_token")
        res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
