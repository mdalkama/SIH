import express from "express";
import {
  // Hostel
  createHostel,
  getHostels,
  getHostelById,
  updateHostel,
  deleteHostel,
  // Floor
  addFloor,
  updateFloor,
  getFloors,
  getFloorById,
  deleteFloor,
  // Room
  addRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  // Bed
  addBed,
  getBeds,
  getBedById,
  updateBed,
  deleteBed,
  // Occupant
  allocateBed,
  vacateBed,
  shiftStudent,
  findStudentForShift,
  findStudentForAllocation,
  getAllComplaintsForWarden,
  updateComplaintStatus,
  getAllRoomChangeRequests,
  updateRoomChangeRequestStatus,
  getAllVisitorPasses,
  getDashboardSummary,
  generateMonthlyHostelFees,
} from "../controllers/hostelController/hostelController.js";

const router = express.Router();

// Student search routes
router.get("/student/search/:regNo", findStudentForShift);
router.get("/student/find/:regNo", findStudentForAllocation);

// ---------------- Hostel ----------------
router.post("/", createHostel);
router.get("/", getHostels);
router.get("/:id", getHostelById);
router.put("/:id", updateHostel);
router.delete("/:id", deleteHostel);

// ---------------- Floor ----------------
router.post("/:hostelId/floors", addFloor);
router.get("/:hostelId/floors", getFloors);
router.get("/:hostelId/floors/:floorId", getFloorById);
router.put("/:hostelId/floors/:floorId", updateFloor);
router.delete("/:hostelId/floors/:floorId", deleteFloor);

// ---------------- Room ----------------
router.post("/:hostelId/floors/:floorId/rooms", addRoom);
router.get("/:hostelId/floors/:floorId/rooms", getRooms);
router.get("/:hostelId/floors/:floorId/rooms/:roomId", getRoomById);
router.put("/:hostelId/floors/:floorId/rooms/:roomId", updateRoom);
router.delete("/:hostelId/floors/:floorId/rooms/:roomId", deleteRoom);

// ---------------- Bed ----------------
router.post("/:hostelId/floors/:floorId/rooms/:roomId/beds", addBed);
router.get("/:hostelId/floors/:floorId/rooms/:roomId/beds", getBeds);
router.get("/:hostelId/floors/:floorId/rooms/:roomId/beds/:bedId", getBedById);
router.put("/:hostelId/floors/:floorId/rooms/:roomId/beds/:bedId", updateBed);
router.delete(
  "/:hostelId/floors/:floorId/rooms/:roomId/beds/:bedId",
  deleteBed
);

// ---------------- Occupant (Student Allocation) ----------------
router.post(
  "/:hostelId/floors/:floorId/rooms/:roomId/beds/:bedId/allocate",
  allocateBed
);

// FIX: Changed from GET to POST
router.post(
  "/:hostelId/floors/:floorId/rooms/:roomId/beds/:bedId/vacate",
  vacateBed
);

// ---------------- Shift Student ----------------
router.post("/shift-student", shiftStudent);

// GET all complaints for the warden's college
router.get('/warden/complaints', getAllComplaintsForWarden);

// PUT to update a complaint's status
router.put('/complaints/:studentHostelId/:complaintId', updateComplaintStatus);

router.get('/warden/room-changes', getAllRoomChangeRequests);
router.put('/room-changes/:studentHostelId/:requestId', updateRoomChangeRequestStatus);

// Visitor Passes
router.get('/warden/visitors', getAllVisitorPasses);

router.get('/warden/dashboard-summary', getDashboardSummary);

router.post('/warden/generate-monthly-fees', generateMonthlyHostelFees);

export default router;
