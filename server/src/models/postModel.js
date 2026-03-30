import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema({
    caption: {
        type: String,
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    media: [
        {
            url: {
                type: String,
                required: true
            },
            media_type: {
                type: String,
                enum: ['image', 'video'],
                required: true
            }
        }
    ]
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
