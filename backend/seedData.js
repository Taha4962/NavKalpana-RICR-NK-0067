// ============================================
// Seed Data Script — Direct MongoDB approach
// Run: node seedData.js
// Pre-hashes password, uses native driver inserts
// ============================================

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // ==================== CLEAR ALL COLLECTIONS ====================
    const collections = ['teachers', 'students', 'batches', 'assignments', 'quizzes', 'attendances', 'supportrequests'];
    for (const col of collections) {
      try { await db.collection(col).deleteMany({}); } catch (e) { /* collection may not exist yet */ }
    }
    console.log('Cleared all collections');

    // ==================== TEACHER ====================
    // Pre-hash password to avoid any Mongoose hook issues
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Teacher@123', salt);

    const teacherResult = await db.collection('teachers').insertOne({
      name: 'Prof. Sharma',
      email: 'teacher@portal.com',
      password: hashedPassword,
      designation: 'Senior Faculty',
      profileImage: '',
      role: 'teacher',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('Teacher seeded (email: teacher@portal.com)');

    // ==================== STUDENTS ====================
    const studentsData = [
      { name: 'Aarav Patel', enrollmentId: 'STU001', email: 'aarav@student.com', phone: '9876543210', course: 'Web Development', modules: ['HTML', 'CSS', 'JavaScript', 'React'], github: 'https://github.com/aarav', linkedin: 'https://linkedin.com/in/aarav', attendancePercentage: 92, status: 'Ongoing', skillsAcquired: ['HTML5', 'CSS3', 'JavaScript', 'React'], learningStreak: 15 },
      { name: 'Priya Singh', enrollmentId: 'STU002', email: 'priya@student.com', phone: '9876543211', course: 'Web Development', modules: ['HTML', 'CSS', 'JavaScript'], github: 'https://github.com/priya', linkedin: 'https://linkedin.com/in/priya', attendancePercentage: 85, status: 'Ongoing', skillsAcquired: ['HTML5', 'CSS3', 'JavaScript'], learningStreak: 10 },
      { name: 'Rohan Gupta', enrollmentId: 'STU003', email: 'rohan@student.com', phone: '9876543212', course: 'Web Development', modules: ['HTML', 'CSS'], github: 'https://github.com/rohan', linkedin: 'https://linkedin.com/in/rohan', attendancePercentage: 45, status: 'Ongoing', skillsAcquired: ['HTML5', 'CSS3'], learningStreak: 3 },
      { name: 'Sneha Reddy', enrollmentId: 'STU004', email: 'sneha@student.com', phone: '9876543213', course: 'DSA', modules: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'DP'], github: 'https://github.com/sneha', linkedin: 'https://linkedin.com/in/sneha', attendancePercentage: 98, status: 'Completed', skillsAcquired: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'], learningStreak: 30 },
      { name: 'Vikram Joshi', enrollmentId: 'STU005', email: 'vikram@student.com', phone: '9876543214', course: 'DSA', modules: ['Arrays', 'Linked Lists', 'Trees'], github: 'https://github.com/vikram', linkedin: 'https://linkedin.com/in/vikram', attendancePercentage: 72, status: 'Completed', skillsAcquired: ['Arrays', 'Linked Lists', 'Trees'], learningStreak: 8 },
      { name: 'Ananya Sharma', enrollmentId: 'STU006', email: 'ananya@student.com', phone: '9876543215', course: 'DSA', modules: ['Arrays', 'Linked Lists'], github: 'https://github.com/ananya', linkedin: 'https://linkedin.com/in/ananya', attendancePercentage: 60, status: 'Completed', skillsAcquired: ['Arrays', 'Linked Lists'], learningStreak: 5 },
      { name: 'Karan Mehta', enrollmentId: 'STU007', email: 'karan@student.com', phone: '9876543216', course: 'Python', modules: ['Basics', 'OOP'], github: 'https://github.com/karan', linkedin: 'https://linkedin.com/in/karan', attendancePercentage: 88, status: 'Ongoing', skillsAcquired: ['Python Basics', 'OOP'], learningStreak: 12 },
      { name: 'Meera Iyer', enrollmentId: 'STU008', email: 'meera@student.com', phone: '9876543217', course: 'Python', modules: ['Basics'], github: 'https://github.com/meera', linkedin: 'https://linkedin.com/in/meera', attendancePercentage: 55, status: 'Ongoing', skillsAcquired: ['Python Basics'], learningStreak: 4 },
      { name: 'Dev Kapoor', enrollmentId: 'STU009', email: 'dev@student.com', phone: '9876543218', course: 'Web Development', modules: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'], github: 'https://github.com/dev', linkedin: 'https://linkedin.com/in/dev', attendancePercentage: 95, status: 'Ongoing', skillsAcquired: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js'], learningStreak: 20 },
      { name: 'Nisha Agarwal', enrollmentId: 'STU010', email: 'nisha@student.com', phone: '9876543219', course: 'Python', modules: ['Basics', 'OOP', 'Data Science'], github: 'https://github.com/nisha', linkedin: 'https://linkedin.com/in/nisha', attendancePercentage: 30, status: 'Ongoing', skillsAcquired: ['Python Basics', 'OOP', 'Data Science'], learningStreak: 2 },
    ];

    // Add timestamps to each student
    const studentsWithTimestamps = studentsData.map(s => ({ ...s, createdAt: new Date(), updatedAt: new Date() }));
    const studentResult = await db.collection('students').insertMany(studentsWithTimestamps);
    const studentIds = Object.values(studentResult.insertedIds);
    console.log('10 Students seeded');

    // ==================== BATCHES ====================
    const webStudents = studentIds.filter((_, i) => studentsData[i].course === 'Web Development');
    const dsaStudents = studentIds.filter((_, i) => studentsData[i].course === 'DSA');
    const pythonStudents = studentIds.filter((_, i) => studentsData[i].course === 'Python');

    const batchesData = [
      {
        batchName: 'WEB Batch Morning',
        batchType: 'Regular',
        totalStudents: webStudents.length,
        progress: 65,
        status: 'Ongoing',
        students: webStudents,
        startDate: new Date('2026-01-15'),
        endDate: new Date('2026-04-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        batchName: 'DSA Batch Evening',
        batchType: 'Intensive',
        totalStudents: dsaStudents.length,
        progress: 100,
        status: 'Completed',
        students: dsaStudents,
        startDate: new Date('2025-10-01'),
        endDate: new Date('2026-01-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        batchName: 'Python Batch Weekend',
        batchType: 'Weekend',
        totalStudents: pythonStudents.length,
        progress: 0,
        status: 'Upcoming',
        students: pythonStudents,
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-06-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const batchResult = await db.collection('batches').insertMany(batchesData);
    const batchIds = Object.values(batchResult.insertedIds);
    console.log('3 Batches seeded');

    // ==================== ASSIGNMENTS ====================
    const assignmentsData = [
      {
        title: 'Build a Portfolio Website',
        description: 'Create a responsive portfolio website using HTML, CSS, and JavaScript.',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        maxMarks: 100,
        submissionType: 'PDF',
        lessonId: 'WEB-L3',
        batchId: batchIds[0],
        status: 'Active',
        submissions: [
          { studentId: studentIds[0], fileUrl: '/uploads/aarav-portfolio.pdf', submittedAt: new Date(), status: 'Submitted', marks: 0, feedback: '' },
          { studentId: studentIds[1], fileUrl: '/uploads/priya-portfolio.pdf', submittedAt: new Date(), status: 'LateSubmitted', marks: 0, feedback: '' },
          { studentId: studentIds[2], fileUrl: '', submittedAt: null, status: 'NotSubmitted', marks: 0, feedback: '' },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'React Todo App',
        description: 'Build a fully functional todo app with React and state management.',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        maxMarks: 80,
        submissionType: 'PDF',
        lessonId: 'WEB-L5',
        batchId: batchIds[0],
        status: 'Active',
        submissions: [
          { studentId: studentIds[0], fileUrl: '/uploads/aarav-todo.pdf', submittedAt: new Date(), status: 'Evaluated', marks: 75, feedback: 'Great work! Clean code and good UI.' },
          { studentId: studentIds[8], fileUrl: '/uploads/dev-todo.pdf', submittedAt: new Date(), status: 'Submitted', marks: 0, feedback: '' },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Implement Binary Search Tree',
        description: 'Implement BST with insert, delete, and traversal operations in JavaScript.',
        deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        maxMarks: 50,
        submissionType: 'PDF',
        lessonId: 'DSA-L4',
        batchId: batchIds[1],
        status: 'Closed',
        submissions: [
          { studentId: studentIds[3], fileUrl: '/uploads/sneha-bst.pdf', submittedAt: new Date(), status: 'Evaluated', marks: 48, feedback: 'Excellent implementation!' },
          { studentId: studentIds[4], fileUrl: '/uploads/vikram-bst.pdf', submittedAt: new Date(), status: 'Evaluated', marks: 35, feedback: 'Good effort, check edge cases.' },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await db.collection('assignments').insertMany(assignmentsData);
    console.log('3 Assignments seeded');

    // ==================== QUIZZES ====================
    const quizzesData = [
      {
        title: 'JavaScript Fundamentals Quiz',
        duration: 30,
        totalMarks: 40,
        attemptLimit: 2,
        lessonId: 'WEB-L2',
        batchId: batchIds[0],
        questions: [
          { questionText: 'What is the output of typeof null?', options: ['null', 'object', 'undefined', 'string'], correctAnswer: 'object', explanation: 'typeof null returns "object" due to a legacy bug.' },
          { questionText: 'Which method converts JSON to a JavaScript object?', options: ['JSON.parse()', 'JSON.stringify()', 'JSON.convert()', 'JSON.toObject()'], correctAnswer: 'JSON.parse()', explanation: 'JSON.parse() converts a JSON string into a JS object.' },
          { questionText: 'What does === check?', options: ['Value only', 'Type only', 'Value and type', 'Reference'], correctAnswer: 'Value and type', explanation: '=== checks both value and type.' },
          { questionText: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'both', 'neither'], correctAnswer: 'let', explanation: 'let is block-scoped, var is function-scoped.' },
        ],
        attempts: [
          { studentId: studentIds[0], score: 35, attemptedAt: new Date() },
          { studentId: studentIds[1], score: 28, attemptedAt: new Date() },
          { studentId: studentIds[8], score: 40, attemptedAt: new Date() },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Data Structures Basics',
        duration: 45,
        totalMarks: 50,
        attemptLimit: 1,
        lessonId: 'DSA-L1',
        batchId: batchIds[1],
        questions: [
          { questionText: 'Time complexity of array access by index?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)', explanation: 'Array index access is O(1).' },
          { questionText: 'Which data structure uses FIFO?', options: ['Stack', 'Queue', 'Array', 'Tree'], correctAnswer: 'Queue', explanation: 'Queue uses First In First Out.' },
          { questionText: 'Worst case time complexity of quicksort?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n^2)', explanation: 'Quicksort worst case is O(n^2).' },
        ],
        attempts: [
          { studentId: studentIds[3], score: 50, attemptedAt: new Date() },
          { studentId: studentIds[4], score: 38, attemptedAt: new Date() },
          { studentId: studentIds[5], score: 30, attemptedAt: new Date() },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await db.collection('quizzes').insertMany(quizzesData);
    console.log('2 Quizzes seeded');

    // ==================== ATTENDANCE (2 weeks) ====================
    const attendanceData = [];
    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
      const date = new Date();
      date.setDate(date.getDate() - dayOffset);
      date.setHours(9, 0, 0, 0);

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      // Web batch attendance
      attendanceData.push({
        batchId: batchIds[0],
        date,
        remark: 'Web Development - Day ' + (14 - dayOffset) + ' session',
        records: webStudents.map((sid) => ({
          studentId: sid,
          status: Math.random() > 0.2 ? 'Present' : (Math.random() > 0.5 ? 'Absent' : 'Late'),
        })),
        submittedAt: date,
        isEditable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // DSA batch attendance
      attendanceData.push({
        batchId: batchIds[1],
        date,
        remark: 'DSA - Day ' + (14 - dayOffset) + ' session',
        records: dsaStudents.map((sid) => ({
          studentId: sid,
          status: Math.random() > 0.15 ? 'Present' : (Math.random() > 0.5 ? 'Absent' : 'Late'),
        })),
        submittedAt: date,
        isEditable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await db.collection('attendances').insertMany(attendanceData);
    console.log('2 weeks of Attendance seeded');

    // ==================== SUPPORT REQUESTS ====================
    const supportData = [
      {
        studentName: 'Rohan Gupta',
        studentId: 'STU003',
        course: 'Web Development',
        topic: 'CSS Flexbox Issues',
        description: 'I am unable to center elements using flexbox. The layout breaks on mobile devices. Can you help?',
        attachmentUrl: '',
        status: 'Pending',
        reply: '',
        replyFileUrl: '',
        backupClassScheduled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentName: 'Meera Iyer',
        studentId: 'STU008',
        course: 'Python',
        topic: 'OOP Concepts Confusion',
        description: 'I am struggling to understand inheritance and polymorphism. Could you explain with more examples?',
        attachmentUrl: '',
        status: 'Resolved',
        reply: 'I have attached a detailed PDF with examples. Also, review the class recording from Week 3.',
        replyFileUrl: '/uploads/oop-guide.pdf',
        backupClassScheduled: true,
        backupClassDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentName: 'Nisha Agarwal',
        studentId: 'STU010',
        course: 'Python',
        topic: 'Data Science Library Setup',
        description: 'I cannot install pandas and numpy on my system. Getting permission errors repeatedly.',
        attachmentUrl: '',
        status: 'Pending',
        reply: '',
        replyFileUrl: '',
        backupClassScheduled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await db.collection('supportrequests').insertMany(supportData);
    console.log('3 Support Requests seeded');

    console.log('\n=== ALL SEED DATA INSERTED SUCCESSFULLY ===');
    console.log('Login: teacher@portal.com / Teacher@123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
