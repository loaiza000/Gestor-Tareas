import mongoose from "mongoose";

const { model, Schema } = mongoose;

const noteSchema = new Schema({
   title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
},
{
    timestamps: true
});

export const noteModel = model("notas", noteSchema)



