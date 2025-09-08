import StudentHostel from "./models/studentHostel.js";
import Hostel from "./models/hostel.js";
import dayjs from "dayjs";

async function generateMonthlyFees() {
    const month = dayjs().format("YYYY-MM"); // "2025-09"

    const students = await StudentHostel.find()
        .populate("currentHostel.hostel currentHostel.room");

    for (let s of students) {
        const already = s.fees.find(f => f.month === month);
        if (already) continue;

        let amount = 0;
        if (s.currentHostel?.room?.price) {
            amount = s.currentHostel.room.price;
        } else {
            amount = 5000; // fallback default price
        }

        s.fees.push({
            month,
            amount,
            roomDetail: s.currentHostel,
            status: "Unpaid",
            paidAmount: 0,
            dueAmount: amount
        });

        await s.save();
    }

    console.log(`✅ Hostel fees generated for ${month}`);
}

export default generateMonthlyFees;