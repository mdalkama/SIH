import Hostel from "../../models/hostelSchema.js";
import mongoose from "mongoose";
import Staff from "../../models/staffModel.js";
import Student from "../../models/studentModel.js";
import StudentHostel from "../../models/studentHostelModal.js";

// ✅ Create Hostel
export const createHostel = async (req, res) => {
  try {
    const Id = req.user.id;
    const warden = await Staff.findById(Id).select("collegeCode");
    if (!warden) return res.status(404).json({ message: "warden not found" });
    const { name, address, totalFloors } = req.body;

    if (!warden.collegeCode) {
      res.status(400).json({ message: "collegeCode is required" });
    }

    // 1. Required fields check
    if (!name || !address) {
      return res
        .status(400)
        .json({ error: "Hostel name and address are required" });
    }

    // 2. Duplicate check (case-insensitive)
    const existing = await Hostel.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Hostel with this name already exists" });
    }

    // 3. Floor validation
    if (totalFloors && totalFloors < 0) {
      return res.status(400).json({ error: "Total floors cannot be negative" });
    }

    // Create new hostel
    const hostel = new Hostel({
      name,
      address,
      totalFloors,
      collegeCode: warden.collegeCode,
    });
    await hostel.save();

    res.status(201).json({ success: true, data: hostel });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Get all hostels
export const getHostels = async (req, res) => {
  try {
    const userId = req.user.id;
    const userCollegeCode = await Staff.findById(userId).select("collegeCode");
    if (!userCollegeCode)
      return res.status(404).json({ message: "collegeCode not found" });

    // fetch hostels only for that college
    const hostels = await Hostel.find({
      collegeCode: userCollegeCode.collegeCode,
    })
      .sort({ createdAt: -1 })
      .select("_id name address totalFloors collegeCode floors");

    const data = hostels.map((hostel) => {
      let totalRooms = 0;
      let totalBeds = 0;
      let allocatedBeds = 0;
      let vacantBeds = 0;

      hostel.floors.forEach((floor) => {
        totalRooms += floor.rooms.length;
        floor.rooms.forEach((room) => {
          totalBeds += room.beds.length;
          room.beds.forEach((bed) => {
            if (bed.isOccupied) allocatedBeds++;
            else vacantBeds++;
          });
        });
      });

      return {
        _id: hostel._id,
        name: hostel.name,
        address: hostel.address,
        totalFloors: hostel.totalFloors,
        totalRooms,
        totalBeds,
        allocatedBeds,
        vacantBeds,
        collegeCode: userCollegeCode.collegeCode,
      };
    });

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Get hostel by ID
export const getHostelById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid hostel ID" });
    }

    const hostel = await Hostel.findById(id);
    if (!hostel) {
      return res.status(404).json({ error: "Hostel not found" });
    }

    res.json({ success: true, data: hostel });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Update hostel
export const updateHostel = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid hostel ID" });
    }

    const hostel = await Hostel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // Ensures schema validations are applied
    });

    if (!hostel) {
      return res.status(404).json({ error: "Hostel not found" });
    }

    res.json({ success: true, data: hostel });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ✅ Delete hostel
export const deleteHostel = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid hostel ID" });
    }

    const hostel = await Hostel.findById(id);
    if (!hostel) {
      return res.status(404).json({ error: "Hostel not found" });
    }

    // Optional: prevent delete if hostel has floors/rooms
    if (hostel.floors && hostel.floors.length > 0) {
      return res
        .status(400)
        .json({ error: "Cannot delete hostel with existing floors/rooms" });
    }

    await hostel.deleteOne();
    res.json({ success: true, message: "Hostel deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// floor controller

// Add Floor
export const addFloor = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const { floorNumber } = req.body;

    if (!mongoose.Types.ObjectId.isValid(hostelId)) {
      return res.status(400).json({ error: "Invalid hostel ID" });
    }

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ error: "Hostel not found" });
    }

    // Check if floorNumber exceeds totalFloors
    if (hostel.floors.length >= hostel.totalFloors) {
      return res
        .status(400)
        .json({ error: `Cannot add more than ${hostel.totalFloors} floors` });
    }

    // Check duplicate floorNumber
    if (hostel.floors.some((f) => f.floorNumber === floorNumber)) {
      return res
        .status(400)
        .json({ error: "Floor number already exists in this hostel" });
    }

    hostel.floors.push({ floorNumber, rooms: [] }); // initialize rooms array
    await hostel.save();

    res.status(201).json({ success: true, data: hostel });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// update floor
export const updateFloor = async (req, res) => {
  try {
    const { hostelId, floorId } = req.params;
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    // FIX: Using .find() for reliability
    const floor = hostel.floors.find(f => f._id.equals(floorId));
    if (!floor) return res.status(404).json({ error: "Floor not found" });

    if (req.body.floorNumber !== undefined) {
      floor.floorNumber = req.body.floorNumber;
    }
    await hostel.save();
    res.json({ success: true, message: "Floor updated successfully" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

//  Get All Floors of a Hostel
export const getFloors = async (req, res) => {
  try {
    const { hostelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(hostelId)) {
      return res.status(400).json({ error: "Invalid hostel ID" });
    }

    // fetch only floors data
    const hostel = await Hostel.findById(hostelId).select(
      "floors._id floors.floorNumber floors.rooms.beds"
    );
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    const floors = hostel.floors.map((f) => {
      let totalRooms = f.rooms.length;
      let totalBeds = 0;
      let allocatedBeds = 0;
      let vacantBeds = 0;

      f.rooms.forEach((room) => {
        totalBeds += room.beds.length;
        room.beds.forEach((bed) => {
          if (bed.isOccupied) allocatedBeds++;
          else vacantBeds++;
        });
      });

      return {
        _id: f._id,
        floorNumber: f.floorNumber,
        totalRooms,
        totalBeds,
        allocatedBeds,
        vacantBeds,
      };
    });

    res.json({ success: true, data: floors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Floor by ID
export const getFloorById = async (req, res) => {
  try {
    const { hostelId, floorId } = req.params;
    const hostel = await Hostel.findById(hostelId).select("floors");
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    // FIX: Using .find() for reliability
    const floor = hostel.floors.find(f => f._id.equals(floorId));
    if (!floor) return res.status(404).json({ error: "Floor not found" });

    res.json({ success: true, data: floor });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Delete Floor
export const deleteFloor = async (req, res) => {
  try {
    const { hostelId, floorId } = req.params;
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    const floor = hostel.floors.find(f => f._id.equals(floorId));
    if (!floor) return res.status(404).json({ error: "Floor not found" });

    if (floor.rooms && floor.rooms.length > 0) {
      return res.status(400).json({ error: "Cannot delete floor with existing rooms" });
    }
    hostel.floors.pull(floorId);
    await hostel.save();
    res.json({ success: true, message: "Floor deleted successfully" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// room controller

// Add room to floor
export const addRoom = async (req, res) => {
  try {
    const { hostelId, floorId } = req.params;
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    // FIX: Using .find() for reliability
    const floor = hostel.floors.find(f => f._id.equals(floorId));
    if (!floor) return res.status(404).json({ error: "Floor not found" });
    
    // ... rest of your logic is fine ...
    const { roomNumber, capacity, beds } = req.body;
    if (floor.rooms.some((r) => r.roomNumber === roomNumber)) {
      return res.status(400).json({ error: "Room number already exists on this floor" });
    }
    if (capacity && beds && capacity !== beds.length) {
      return res.status(400).json({ error: "Capacity must match number of beds provided" });
    }
    floor.rooms.push(req.body);
    await hostel.save();
    res.status(201).json({ success: true, data: hostel });
  } catch (err) { res.status(400).json({ error: err.message }); }
};

// ✅ Get All Rooms in a Floor
export const getRooms = async (req, res) => {
  try {
    const { hostelId, floorId } = req.params;
    const hostel = await Hostel.findById(hostelId).select("floors.rooms floors._id");
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    // FIX: Using .find() for reliability
    const floor = hostel.floors.find(f => f._id.equals(floorId));
    if (!floor) return res.status(404).json({ error: "Floor not found" });

    const rooms = floor.rooms.map((room) => ({
        _id: room._id, roomNumber: room.roomNumber, roomType: room.roomType,
        totalBeds: room.beds.length,
        allocatedBeds: room.beds.filter((b) => b.isOccupied).length,
        vacantBeds: room.beds.filter((b) => !b.isOccupied).length,
    }));
    res.json({ success: true, data: rooms });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ✅ Get Room by ID
export const getRoomById = async (req, res) => {
  try {
    const { hostelId, floorId, roomId } = req.params;
    const hostel = await Hostel.findById(hostelId).select("floors");
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });
    
    // FIX: Using .find() for reliability
    const floor = hostel.floors.find(f => f._id.equals(floorId));
    if (!floor) return res.status(404).json({ error: "Floor not found" });
    const room = floor.rooms.find(r => r._id.equals(roomId));
    if (!room) return res.status(404).json({ error: "Room not found" });

    res.json({ success: true, data: room });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Update Room
export const updateRoom = async (req, res) => {
  try {
    const { hostelId, floorId, roomId } = req.params;

    if (
      ![hostelId, floorId, roomId].every((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )
    ) {
      return res.status(400).json({ error: "Invalid ID(s)" });
    }

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    const floor = hostel.floors.id(floorId);
    if (!floor) return res.status(404).json({ error: "Floor not found" });

    const room = floor.rooms.id(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    // Allowed updates
    const allowedUpdates = ["roomNumber", "roomType", "capacity", "facilities"];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        room[field] = req.body[field];
      }
    });

    await hostel.save();

    res.json({
      success: true,
      message: "Room updated successfully",
      data: hostel,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Room
export const deleteRoom = async (req, res) => {
  try {
    const { hostelId, floorId, roomId } = req.params;

    // 1. Validate IDs
    if (
      ![hostelId, floorId, roomId].every((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )
    ) {
      return res.status(400).json({ error: "Invalid ID(s)" });
    }

    // 2. Find hostel
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    // 3. Find floor
    const floor = hostel.floors.id(floorId);
    if (!floor) return res.status(404).json({ error: "Floor not found" });

    // 4. Find room
    const room = floor.rooms.id(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    // 5. Prevent delete if any bed is occupied
    if (room.beds && room.beds.some((b) => b.occupied)) {
      return res
        .status(400)
        .json({ error: "Cannot delete room with occupied beds" });
    }

    // 6. Remove room using pull
    floor.rooms.pull(roomId);

    await hostel.save();

    res.json({
      success: true,
      message: "Room deleted successfully",
      data: hostel,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// bed controller

// Add Bed to Room
export const addBed = async (req, res) => {
  try {
    const { hostelId, floorId, roomId } = req.params;
    const { bedNumber } = req.body;
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    const floor = hostel.floors.find(f => f._id.equals(floorId));
    if (!floor) return res.status(404).json({ error: "Floor not found" });
    const room = floor.rooms.find(r => r._id.equals(roomId));
    if (!room) return res.status(404).json({ error: "Room not found" });
    
    if (room.beds.some((b) => b.bedNumber === bedNumber)) {
      return res.status(400).json({ error: "Bed number already exists in this room" });
    }
    if (room.capacity && room.beds.length >= room.capacity) {
      return res.status(400).json({ error: "Room capacity reached. Cannot add more beds." });
    }
    room.beds.push(req.body);
    await hostel.save();
    res.status(201).json({ success: true, data: hostel });
  } catch (err) { res.status(400).json({ error: err.message }); }
};
export const getBeds = async (req, res) => {
    try {
        const { hostelId, floorId, roomId } = req.params;
        const hostel = await Hostel.findById(hostelId).select('floors');
        if (!hostel) return res.status(404).json({ error: 'Hostel not found' });
        
        const floor = hostel.floors.find(f => f._id.equals(floorId));
        if (!floor) return res.status(404).json({ error: 'Floor not found' });
        
        const room = floor.rooms.find(r => r._id.equals(roomId));
        if (!room) return res.status(404).json({ error: 'Room not found' });

        const bedsWithStudents = await Promise.all(
            room.beds.map(async (bed) => {
                if (bed.isOccupied && bed.occupant) {
                    const student = await Student.findById(bed.occupant).select("name registrationNumber").lean();
                    return { ...bed.toObject(), student };
                }
                return bed.toObject();
            })
        );
        res.json({ success: true, data: bedsWithStudents });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// ✅ Get Bed by ID
export const getBedById = async (req, res) => {
  try {
    const { hostelId, floorId, roomId, bedId } = req.params;

    if (
      ![hostelId, floorId, roomId, bedId].every((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )
    ) {
      return res.status(400).json({ error: "Invalid ID(s)" });
    }

    const hostel = await Hostel.findById(hostelId).select("floors");
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    const floor = hostel.floors.id(floorId);
    if (!floor) return res.status(404).json({ error: "Floor not found" });

    const room = floor.rooms.id(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const bed = room.beds.id(bedId);
    if (!bed) return res.status(404).json({ error: "Bed not found" });

    res.json({ success: true, data: bed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Update Bed
export const updateBed = async (req, res) => {
  try {
    const { hostelId, floorId, roomId, bedId } = req.params;

    if (
      ![hostelId, floorId, roomId, bedId].every((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )
    ) {
      return res.status(400).json({ error: "Invalid ID(s)" });
    }

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    const floor = hostel.floors.id(floorId);
    if (!floor) return res.status(404).json({ error: "Floor not found" });

    const room = floor.rooms.id(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const bed = room.beds.id(bedId);
    if (!bed) return res.status(404).json({ error: "Bed not found" });

    // Allowed updates
    const allowedUpdates = ["bedNumber", "isOccupied", "occupant"];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        bed[field] = req.body[field];
      }
    });

    await hostel.save();

    res.json({
      success: true,
      message: "Bed updated successfully",
      data: hostel,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Bed
export const deleteBed = async (req, res) => {
  try {
    const { hostelId, floorId, roomId, bedId } = req.params;

    if (
      ![hostelId, floorId, roomId, bedId].every((id) =>
        mongoose.Types.ObjectId.isValid(id)
      )
    ) {
      return res.status(400).json({ error: "Invalid ID(s)" });
    }

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    const floor = hostel.floors.id(floorId);
    if (!floor) return res.status(404).json({ error: "Floor not found" });

    const room = floor.rooms.id(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const bed = room.beds.id(bedId);
    if (!bed) return res.status(404).json({ error: "Bed not found" });

    if (bed.isOccupied) {
      return res.status(400).json({ error: "Cannot delete an occupied bed" });
    }

    room.beds.pull(bedId);
    await hostel.save();

    res.json({
      success: true,
      message: "Bed deleted successfully",
      data: room.beds,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Allocate Bed + Update StudentHostel (Fetch studentId from Student schema)

export const allocateBed = async (req, res) => {
  try {
    const { hostelId, floorId, roomId, bedId } = req.params;
    const { registrationNumber } = req.body;

    if (!registrationNumber) {
        return res.status(400).json({ error: "Registration number is required." });
    }

    // 1. Student ko registration number se dhoondho
    const student = await Student.findOne({ registrationNumber });
    if (!student) {
        return res.status(404).json({ error: "Student not found with this registration number." });
    }

    // 2. Check karo ki student pehle se hi allocated toh nahi hai
    const existingAllocation = await StudentHostel.findOne({ 
        occupant: student._id,
        currentHostel: { $ne: null } // Check karo ki currentHostel null na ho
    });

    if (existingAllocation) {
        return res.status(409).json({ error: "This student is already allocated to another bed." });
    }

    // 3. Hostel, floor, room, aur bed dhoondho
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });

    const floor = hostel.floors.find(f => f._id.equals(floorId));
    if (!floor) return res.status(404).json({ error: "Floor not found" });

    const room = floor.rooms.find(r => r._id.equals(roomId));
    if (!room) return res.status(404).json({ error: "Room not found" });

    const bed = room.beds.find(b => b._id.equals(bedId));
    if (!bed) return res.status(404).json({ error: "Bed not found" });

    // 4. Check karo ki bed khali hai ya nahi
    if (bed.isOccupied) {
        return res.status(400).json({ error: "This bed is already occupied." });
    }
    
    // 5. Bed ko occupied mark karo aur hostel document save karo
    bed.isOccupied = true;
    bed.occupant = student._id;
    await hostel.save();

    // 6. StudentHostel record ko update ya create karo
    let studentHostel = await StudentHostel.findOne({ occupant: student._id });

    if (studentHostel) {
        // Agar record pehle se hai (vacated state me), toh use update karo
        studentHostel.currentHostel = {
            hostel: hostelId,
            floor: floorId,
            room: roomId,
            bed: bedId,
        };
    } else {
        // Agar record nahi hai, toh naya banao
        studentHostel = new StudentHostel({
            registrationNumber: student.registrationNumber,
            occupant: student._id,
            currentHostel: {
                hostel: hostelId,
                floor: floorId,
                room: roomId,
                bed: bedId,
            },
        });
    }

    await studentHostel.save();

    // 7. Success response bhejo
    res.status(200).json({
      success: true,
      message: "Bed allocated successfully!",
    });

  } catch (err) {
    console.error("Error in allocateBed:", err);
    res.status(500).json({ error: err.message });
  }
};

export const findStudentForAllocation = async (req, res) => {
  try {
    const { regNo } = req.params;
    const student = await Student.findOne({ registrationNumber: regNo }).lean();
    console.log("student", student);

    if (!student) {
      return res
        .status(404)
        .json({ error: "Student not found with this registration number." });
    }

    // Check if student is already allocated
    const alreadyAllocated = await StudentHostel.findOne({
      occupant: student._id,
    });
    console.log("alreadyAllocated", alreadyAllocated);
    if (alreadyAllocated) {
      return res
        .status(409)
        .json({ error: "This student is already allocated to a bed." });
    }

    res.json({
      success: true,
      data: {
        _id: student._id,
        name: student.name,
        registrationNumber: student.registrationNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
};

// Vacate Bed (By Selection Only)
export const vacateBed = async (req, res) => {
  try {
    const { hostelId, floorId, roomId, bedId } = req.params;
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ error: "Hostel not found" });
    
    const floor = hostel.floors.find(f => f._id.equals(floorId));
    if (!floor) return res.status(404).json({ error: "Floor not found" });
    const room = floor.rooms.find(r => r._id.equals(roomId));
    if (!room) return res.status(404).json({ error: "Room not found" });
    const bed = room.beds.find(b => b._id.equals(bedId));
    if (!bed) return res.status(404).json({ error: "Bed not found" });
    
    if (!bed.isOccupied) return res.status(400).json({ error: "Bed is already vacant" });

    const studentId = bed.occupant;
    bed.isOccupied = false;
    bed.occupant = null;
    await hostel.save();

    const studentHostel = await StudentHostel.findOne({ occupant: studentId });
    if (studentHostel) {
      studentHostel.currentHostel = null;
      studentHostel.occupant = null;
      await studentHostel.save();
    }
    res.json({ success: true, message: "Bed vacated successfully" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const shiftStudent = async (req, res) => {
  try {
    const { studentId, newHostelId, newFloorId, newRoomId, newBedId } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    let studentHostel = await StudentHostel.findOne({ occupant: student._id });
    
    // Purana Bed Khali Karo
    if (studentHostel && studentHostel.currentHostel) {
      const { hostel: oldHostelId, floor: oldFloorId, room: oldRoomId, bed: oldBedId } = studentHostel.currentHostel;
      const oldHostel = await Hostel.findById(oldHostelId);
      if (oldHostel) {
        const oldFloor = oldHostel.floors.find(f => f._id.equals(oldFloorId));
        const oldRoom = oldFloor?.rooms.find(r => r._id.equals(oldRoomId));
        const oldBed = oldRoom?.beds.find(b => b._id.equals(oldBedId));
        if (oldBed) {
          oldBed.isOccupied = false;
          oldBed.occupant = null;
          await oldHostel.save();
        }
      }
    }

    // Naya Bed Allocate Karo
    const newHostel = await Hostel.findById(newHostelId);
    if (!newHostel) return res.status(404).json({ error: "New Hostel not found" });
    const newFloor = newHostel.floors.find(f => f._id.equals(newFloorId));
    if (!newFloor) return res.status(404).json({ error: "New Floor not found" });
    const newRoom = newFloor.rooms.find(r => r._id.equals(newRoomId));
    if (!newRoom) return res.status(404).json({ error: "New Room not found" });
    const newBed = newRoom.beds.find(b => b._id.equals(newBedId));
    if (!newBed) return res.status(404).json({ error: "New Bed not found" });
    if (newBed.isOccupied) return res.status(400).json({ error: "New Bed is already occupied" });

    newBed.isOccupied = true;
    newBed.occupant = student._id;
    await newHostel.save();

    // StudentHostel record update karo
    if (!studentHostel) {
      studentHostel = new StudentHostel({ registrationNumber: student.registrationNumber, occupant: student._id });
    }
    studentHostel.currentHostel = { hostel: newHostelId, floor: newFloorId, room: newRoomId, bed: newBedId };
    await studentHostel.save();

    res.json({ success: true, message: "Student shifted successfully" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const findStudentForShift = async (req, res) => {
  try {
    const { regNo } = req.params;
    const student = await Student.findOne({ registrationNumber: regNo }).lean();
    if (!student) return res.status(404).json({ error: "Student not found with this registration number." });

    const studentHostelInfo = await StudentHostel.findOne({ occupant: student._id })
      .populate('currentHostel.hostel', 'name').lean();

    if (!studentHostelInfo || !studentHostelInfo.currentHostel) {
      return res.status(404).json({ error: "This student is not currently allocated to any bed." });
    }
    
    const { hostel, floor: floorId, room: roomId, bed: bedId } = studentHostelInfo.currentHostel;
    const fullHostelDoc = await Hostel.findById(hostel._id);
    if (!fullHostelDoc) return res.status(404).json({ error: "Associated hostel data not found." });

    const floor = fullHostelDoc.floors.find(f => f._id.equals(floorId));
    const room = floor?.rooms.find(r => r._id.equals(roomId));
    const bed = room?.beds.find(b => b._id.equals(bedId));

    if (!floor || !room || !bed) {
      return res.status(404).json({ error: "Could not locate the specific floor/room/bed. Data might be inconsistent." });
    }

    res.json({ success: true, data: {
      _id: student._id, name: student.name, registrationNumber: student.registrationNumber,
      currentIds: { hostelId: hostel._id, floorId, roomId, bedId },
      currentLocation: { hostelName: hostel.name, floorNumber: floor.floorNumber, roomNumber: room.roomNumber, bedNumber: bed.bedNumber },
    }});
  } catch (error) { res.status(500).json({ error: "Server error while finding student." }); }
};
