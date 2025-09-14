import mongoose from "mongoose";
const { Schema } = mongoose;

const collegeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'College name is required.'],
        trim: true
    },
    code: {
        type: String,
        required: [true, 'A unique College Code is required.'],
        unique: true,
        uppercase: true,
        trim: true
    },
    type: {
        type: String,
        required: [true, 'College type is required (e.g., Engineering, Medical).'],
        trim: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Pending Approval'],
        default: 'Pending Approval'
    },
    affiliationId: {
        type: String,
        required: [true, 'University-provided affiliation ID is required.'],
        trim: true
    },
    establishmentDate: {
        type: Date
    },
    capacity: {
        type: Number,
        min: 0
    },
    logoUrl: {
        type: String,
        trim: true
    },
    officeAddress: {
        address: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true }
    },
    administration:[
        {   
            slno:{type:Number},
            name: { type: String, trim: true },
            phone: { type: String, trim: true },
            email: { type: String, trim: true },
            designation: { type: String, trim: true }
        }
    ],
    placement:[
        {
            slno:{type:Number},
            name: { type: String, trim: true },
            department: {type:String,trim:true},
            role:{type:String,trim:true},
            company:{type:String,trim:true},
            package:{type:String,trim:true}
        }
    ],
    socialmedia:{
        facebook:{type:String,trim:true},
        instagram:{type:String,trim:true},
        twitter:{type:String,trim:true},
        linkedin:{type:String,trim:true},
        youtube:{type:String,trim:true},
        webiste:{type:String,trim:true},
        gplus:{type:String,trim:true}
    },
    topRecruiter:[
        {
            name:{type:String,trim:true},
            logoUrl:{type:String,trim:true},
        }
    ],
    messageFrom:[
        {
            role:{type:String},
            name: { type: String, trim: true},
            message:{type:String}
        }
    ],
    // --- Contact & Location ---
    location: {
        address: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true }
    },
    contact: {
        email: {
            type: String,
            required: [true, 'Contact email is required.'],
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Contact phone number is required.'],
            trim: true
        },
        website: {
            type: String,
            trim: true
        }
    },

    // --- Relationships ---
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
        required: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff' // Reference to the College Admin in the Staff collection
    },
    courses: [{
        courseId: {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        fees: [
            {
                semester: {
                    type: Number,
                    required: true
                },
                fees: {
                    type: Number,
                    required: true,
                    
                }
            }
        ]
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],

}, {
    timestamps: true
});

export default mongoose.model("College", collegeSchema);
