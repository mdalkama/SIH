import express from "express";
import {
    // Hostel
    createHostel, getHostels, getHostelById, updateHostel, deleteHostel,
    // Floor
    addFloor, updateFloor, getFloors, getFloorById, deleteFloor,
    // Room
    addRoom, getRooms, getRoomById, updateRoom, deleteRoom,
    // Bed
    addBed, getBeds, getBedById, updateBed, deleteBed,
    // Occupant
    allocateBed, vacateBed, shiftStudent
} from "../controllers/hostelController/hostelController.js";

const router = express.Router();


// ---------------- Hostel ----------------
router.post("/", createHostel);          // Create hostel
router.get("/", getHostels);             // Get all hostels
router.get("/:id", getHostelById);       // Get single hostel
router.put("/:id", updateHostel);        // Update hostel
router.delete("/:id", deleteHostel);     // Delete hostel


// ---------------- Floor ----------------
router.post("/:hostelId/floors", addFloor);                // Add floor
router.get("/:hostelId/floors", getFloors);                // Get all floors
router.get("/:hostelId/floors/:floorId", getFloorById);    // Get floor by id
router.put("/:hostelId/floors/:floorId", updateFloor);     // Update floor
router.delete("/:hostelId/floors/:floorId", deleteFloor);  // Delete floor


// ---------------- Room ----------------
router.post("/:hostelId/floors/:floorId/rooms", addRoom);                  // Add room
router.get("/:hostelId/floors/:floorId/rooms", getRooms);                  // Get all rooms
router.get("/:hostelId/floors/:floorId/rooms/:roomId", getRoomById);       // Get room by id
router.put("/:hostelId/floors/:floorId/rooms/:roomId", updateRoom);        // Update room
router.delete("/:hostelId/floors/:floorId/rooms/:roomId", deleteRoom);     // Delete room


// ---------------- Bed ----------------
router.post("/:hostelId/floors/:floorId/rooms/:roomId/beds", addBed);                  // Add bed
router.get("/:hostelId/floors/:floorId/rooms/:roomId/beds", getBeds);                  // Get all beds
router.get("/:hostelId/floors/:floorId/rooms/:roomId/beds/:bedId", getBedById);        // Get bed by id
router.put("/:hostelId/floors/:floorId/rooms/:roomId/beds/:bedId", updateBed);         // Update bed
router.delete("/:hostelId/floors/:floorId/rooms/:roomId/beds/:bedId", deleteBed);      // Delete bed


// ---------------- Occupant (Student Allocation) ----------------
router.post("/:hostelId/floors/:floorId/rooms/:roomId/beds/:bedId/allocate", allocateBed);  // Allocate student
router.post("/:hostelId/floors/:floorId/rooms/:roomId/beds/:bedId/vacate", vacateBed);      // Vacate bed

// ---------------- Shift Student ----------------
router.post("/shift-student", shiftStudent);   // Shift student from one bed to another


export default router;
