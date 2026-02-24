// ============================================
// Student Model
// Stores student profile, courses, and progress
// ============================================

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  enrollmentId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  course: { type: String, required: true },
  modules: [{ type: String }],
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  attendancePercentage: { type: Number, default: 0 },
  status: { type: String, enum: ['Ongoing', 'Completed'], default: 'Ongoing' },
  profileImage: { type: String, default: '' },
  skillsAcquired: [{ type: String }],
  learningStreak: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
