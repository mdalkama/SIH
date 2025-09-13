// controllers/studentHostelController.js

import StudentHostel from "../../models/studentHostelModal.js";
import Student from "../../models/studentModel.js";
import Hostel from "../../models/hostelSchema.js";

// Get logged-in student's current allocation details
export const getMyAllocation = async (req, res) => {
  try {
    const studentId = req.user.id;

    const studentHostel = await StudentHostel.findOne({ occupant: studentId })
      .populate({
        path: "currentHostel.hostel",
        select: "name warden address",
      })
      .populate("occupant", "name registrationNumber")
      .lean();

    if (!studentHostel || !studentHostel.currentHostel) {
      return res
        .status(404)
        .json({ message: "You are not currently allocated to any hostel." });
    }

    const {
      hostel,
      floor: floorId,
      room: roomId,
    } = studentHostel.currentHostel;

    const fullHostelDoc = await Hostel.findById(hostel._id).lean();
    const floor = fullHostelDoc.floors.find((f) => f._id.equals(floorId));
    const room = floor?.rooms.find((r) => r._id.equals(roomId));

    if (!floor || !room) {
      return res
        .status(404)
        .json({ message: "Could not retrieve full room details." });
    }

    const data = {
      name: studentHostel.occupant.name,
      rollNumber: studentHostel.occupant.registrationNumber,
      hostelName: hostel.name,
      hostelAddress: hostel.address,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      floorNumber: floor.floorNumber,
      warden: hostel.warden?.name || "Not Assigned",
      wardenContact: hostel.warden?.contact || "N/A",
      checkInDate: studentHostel.createdAt,
    };

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Raise a new complaint
export const raiseComplaint = async (req, res) => {
  try {
    const studentId = req.user.id;

    const { issue, priority, title, description } = req.body;

    // Validation
    if (!issue || !title || !description) {
      return res
        .status(400)
        .json({
          message: "Issue, title, and description are required fields.",
        });
    }

    const studentHostel = await StudentHostel.findOne({ occupant: studentId });
    if (!studentHostel || !studentHostel.currentHostel) {
      return res
        .status(404)
        .json({
          message:
            "Student is not allocated to a hostel. Cannot raise complaint.",
        });
    }

    const hostelDoc = await Hostel.findById(
      studentHostel.currentHostel.hostel
    ).lean();
    if (!hostelDoc)
      return res.status(404).json({ message: "Hostel not found." });

    const floorDoc = hostelDoc.floors.find((f) =>
      f._id.equals(studentHostel.currentHostel.floor)
    );
    const roomDoc = floorDoc?.rooms.find((r) =>
      r._id.equals(studentHostel.currentHostel.room)
    );
    const bedDoc = roomDoc?.beds.find((b) =>
      b._id.equals(studentHostel.currentHostel.bed)
    );

    if (!floorDoc || !roomDoc || !bedDoc) {
      return res
        .status(404)
        .json({
          message: "Could not locate full hostel details for the complaint.",
        });
    }

    // Nayi complaint ko complaints array me push karo
    studentHostel.complaints.push({
      title,
      description,
      issue, // Ab 'issue' seedhe req.body se aa raha hai
      priority,
      status: "Open",
      hostelDetail: {
        hostelName: hostelDoc.name,
        floorNumber: floorDoc.floorNumber,
        roomNumber: roomDoc.roomNumber,
        bedNumber: bedDoc.bedNumber,
      },
    });

    await studentHostel.save();

    res.status(201).json({
      success: true,
      message: "Complaint raised successfully!",
      data: studentHostel.complaints,
    });
  } catch (error) {
    console.error("Error raising complaint:", error);
    res
      .status(400)
      .json({ message: "Failed to raise complaint", error: error.message });
  }
};

// Get all complaints for the logged-in student
export const getMyComplaints = async (req, res) => {
  try {
    const studentId = req.user.id;
    const studentHostel = await StudentHostel.findOne({ occupant: studentId })
      .select("complaints")
      .lean();

    if (!studentHostel) {
      return res.json({ success: true, data: [] }); // Agar record nahi, toh khali array
    }

    const sortedComplaints = studentHostel.complaints.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({ success: true, data: sortedComplaints });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//request room change
export const requestRoomChange = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { reason } = req.body;
    if (!reason)
      return res
        .status(400)
        .json({ message: "Reason for room change is required." });

    const studentHostel = await StudentHostel.findOne({ occupant: studentId });
    if (!studentHostel || !studentHostel.currentHostel) {
      return res
        .status(404)
        .json({ message: "You are not allocated to a room." });
    }

    // Add the request to the array
    studentHostel.roomChangeRequests.push({
      reason,
      from: studentHostel.currentHostel, // Store the current location
    });

    await studentHostel.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Room change request submitted successfully.",
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add a new visitor
export const addVisitor = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { name, relation, purpose } = req.body;
    if (!name)
      return res.status(400).json({ message: "Visitor name is required." });

    const studentHostel = await StudentHostel.findOne({ occupant: studentId });
    if (!studentHostel) {
      return res
        .status(404)
        .json({ message: "Student hostel record not found." });
    }

    // Add the visitor to the array
    studentHostel.visitors.push({ name, relation, purpose });

    await studentHostel.save();
    res
      .status(201)
      .json({ success: true, message: "Visitor pass generated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyRoomChangeRequests = async (req, res) => {
  try {
    const studentId = req.user.id;
    const studentHostel = await StudentHostel.findOne({ occupant: studentId })
      .select("roomChangeRequests")
      .lean();

    if (!studentHostel) {
      // If the student has no hostel record, return an empty array
      return res.json({ success: true, data: [] });
    }

    // Sort requests by date, newest first
    const sortedRequests = studentHostel.roomChangeRequests.sort(
      (a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)
    );

    res.json({ success: true, data: sortedRequests });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all visitor passes for the logged-in student
export const getMyVisitors = async (req, res) => {
  try {
    const studentId = req.user.id;
    const studentHostel = await StudentHostel.findOne({ occupant: studentId })
      .select("visitors")
      .lean();

    if (!studentHostel) {
      // If the student has no hostel record, return an empty array
      return res.json({ success: true, data: [] });
    }

    // Sort visitors by date, newest first
    const sortedVisitors = studentHostel.visitors.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.json({ success: true, data: sortedVisitors });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyFees = async (req, res) => {
  try {
    const { registrationNumber, collegeCode } = req.user;

    const academicPayments = await StudentPayment.findOne({
      registrationNumber,
      collegeCode,
    });

    const hostelPayments = await StudentHostel.findOne({
      registrationNumber,
      collegeCode,
    }).select("fees");

    if (!academicPayments && !hostelPayments) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No fee records found for this student.",
        });
    }

    res.status(200).json({
      success: true,
      data: {
        semesters: academicPayments?.semesters || [],
        fines: academicPayments?.fines || [],
        hostelFees: hostelPayments?.fees || [],
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
