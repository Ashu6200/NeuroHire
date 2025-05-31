const { default: mongoose } = require("mongoose");


const QASchema = new mongoose.Schema({
    question: { type: String, required: true },
    userAnswer: { type: String, required: true },
    aiFeedback: {
        score: { type: Number, required: true },
        strengths: [{ type: String }],
        areasToImprove: [{ type: String }],
    }, required: true
},);

const interviewResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mockInterviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MockInterview',
        required: true,
    },
    attemptedAt: {
        type: Date,
        default: Date.now,
    },
    stateAt: {
        type: Date,
        required: true,
    },
    endAt: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    totalScore: {
        type: Number,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    skillAssingment: {
        type: Object,
        required: true,
    },
    qa: [QASchema]
}, { timestamps: true })

const InterviewResult = mongoose.model('InterviewResult', interviewResultSchema);
module.exports = InterviewResult;