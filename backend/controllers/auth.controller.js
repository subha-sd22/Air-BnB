import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) return res.status(400).json({ message: "Name, email, and password are required" })
        if (await User.findOne({ email })) return res.status(409).json({ message: "An account with this email already exists" })
        const hashedPassword = bcryptjs.hashSync(password, 10)
        const newUser = new User({ name, email, password: hashedPassword })
        await newUser.save()
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        const { password: pass, ...user } = newUser.toObject()
        res.cookie("access_token", token, { httpOnly: true, sameSite: "lax" }).status(201).json({ ...user, listing: [], booking: [] })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: "User not found" })

        const validPassword = bcryptjs.compareSync(password, user.password)
        if (!validPassword) return res.status(401).json({ message: "Invalid credentials" })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        const { password: pass, ...rest } = user._doc

        const listing = await (await import("../models/listing.model.js")).default.find({ host: user._id })
        const booking = await (await import("../models/booking.model.js")).default.find({ user: user._id }).populate("listing")
        res.cookie("access_token", token, { httpOnly: true, sameSite: "lax" })
            .status(200)
            .json({ ...rest, listing, booking: booking.map((item) => item.listing).filter(Boolean) })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const signout = async (req, res) => {
    try {
        res.clearCookie("access_token")
        res.status(200).json({ message: "Signed out successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
