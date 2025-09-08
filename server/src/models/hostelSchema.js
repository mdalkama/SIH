import mongoose from "mongoose";
const { Schema } = mongoose;


// Each bed/seat in a room
const bedSchema = new Schema({
    bedNumber: { type: String, required: true },
    isOccupied: { type: Boolean, default: false },
    occupant: { type: mongoose.Schema.Types.ObjectId, ref: "Student" }
});

// Room details schema
const roomSchema = new Schema({
    roomNumber: { type: String, required: true }, // eg. 101, 102
    roomType: { type: String, enum: ["Single", "Double", "Triple", "Dorm"], required: true },
    capacity: { type: Number, required: true },
    beds: [bedSchema],
    facilities: [{ type: String }], // eg. ["AC", "Attached Bathroom"]
    price: { type: Number, required: true } // 👈 Room-level price only
});

// Floor schema
const floorSchema = new Schema({
    floorNumber: { type: Number, required: true },
    rooms: [roomSchema],
});

// Hostel main schema
const hostelSchema = new Schema({
    name: { type: String, required: true, unique: true }, // eg. "Boys Hostel Block A"
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
    },
    warden: {
        name: String,
        contact: String,
        staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    },
    totalFloors: { type: Number, required: true },
    floors: [floorSchema],
    createdAt: { type: Date, default: Date.now },
    collegeCode: { type: String },
});

const Hostel = mongoose.model("Hostel", hostelSchema);

export default Hostel;
