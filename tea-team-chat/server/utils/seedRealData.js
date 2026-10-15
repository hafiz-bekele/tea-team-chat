const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');
const Story = require('../models/Story');
const Short = require('../models/Short');
const Pod = require('../models/Pod');
const Message = require('../models/Message');

const seedRealData = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('Password123!', salt);

    // 1. Ensure Real Faculty and TAs exist
    let profYohannes = await User.findOne({ email: 'prof.yohannes@wollo.edu.et' });
    if (!profYohannes) {
      profYohannes = await User.create({
        username: 'prof_yohannes',
        firstName: 'Yohannes',
        lastName: 'Kassahun',
        email: 'prof.yohannes@wollo.edu.et',
        password: defaultPassword,
        role: 'teacher',
        academicTitle: 'Associate Professor',
        department: 'Computer Science',
        officeHours: 'Mon & Wed 2:00 PM - 5:00 PM',
        campus: 'Wollo University - Main Campus (Tech Hall C, Room 204)',
        bio: 'Distributed Systems, Cloud Infrastructure, and Fault-Tolerant Consensus Algorithms.',
        isVerified: true,
        status: 'online'
      });
      console.log('Seeded Faculty: prof_yohannes');
    }

    let drRahel = await User.findOne({ email: 'dr.rahel@wollo.edu.et' });
    if (!drRahel) {
      drRahel = await User.create({
        username: 'dr_rahel',
        firstName: 'Rahel',
        lastName: 'Mengistu',
        email: 'dr.rahel@wollo.edu.et',
        password: defaultPassword,
        role: 'teacher',
        academicTitle: 'Assistant Professor & Lab Director',
        department: 'Electrical Engineering',
        officeHours: 'Tue & Thu 10:00 AM - 12:30 PM',
        campus: 'Wollo University - Main Campus (EE Lab 4)',
        bio: 'Digital Signal Processing, Embedded Robotics, and Low-Power Bio-Sensors.',
        isVerified: true,
        status: 'online'
      });
      console.log('Seeded Faculty: dr_rahel');
    }

    let abebeTA = await User.findOne({ email: 'abebe.ta@wollo.edu.et' });
    if (!abebeTA) {
      abebeTA = await User.create({
        username: 'abebe_ta',
        firstName: 'Abebe',
        lastName: 'Tadesse',
        email: 'abebe.ta@wollo.edu.et',
        password: defaultPassword,
        role: 'ta',
        academicTitle: 'Graduate Teaching Assistant',
        department: 'Computer Science',
        officeHours: 'Daily 4:00 PM - 6:00 PM',
        campus: 'Wollo University - Tech Block Lab 3',
        bio: 'Assisting Algorithms, Data Structures, and Python Programming Labs.',
        isVerified: true,
        status: 'online'
      });
      console.log('Seeded TA: abebe_ta');
    }

    // Find any student user to link interactions
    const existingStudent = await User.findOne({ role: 'student' }) || profYohannes;

    // 2. Seed Real Posts if empty
    const postsCount = await Post.countDocuments();
    if (postsCount === 0) {
      await Post.create([
        {
          title: 'Midterm Exam Schedule & Laboratory Consultation Hours',
          content: 'All Software Engineering Year 3 students: The Distributed Systems midterm is scheduled for next Tuesday at 9:00 AM in Tech Hall C. My office consultation hours are extended on Monday 1:00 PM - 5:00 PM for project queries.',
          category: 'announcement',
          author: profYohannes._id,
          authorName: 'Prof. Yohannes K.',
          role: 'teacher',
          department: 'Computer Science',
          isPinned: true,
          likes: [existingStudent._id],
          comments: [
            {
              user: existingStudent._id,
              username: existingStudent.username,
              role: 'student',
              text: 'Will the exam cover Raft consensus or only Paxos?',
              createdAt: new Date(Date.now() - 3600000)
            },
            {
              user: profYohannes._id,
              username: 'Prof. Yohannes K.',
              role: 'teacher',
              text: 'Both will be covered, with emphasis on practical leader election in Raft.',
              createdAt: new Date(Date.now() - 1800000)
            }
          ],
          poll: {
            question: 'Preferred Additional Review Session Time:',
            options: [
              { text: 'Monday 4:00 PM - 6:00 PM', votes: [existingStudent._id] },
              { text: 'Saturday Morning 10:00 AM', votes: [] }
            ]
          }
        },
        {
          title: 'Need help understanding Dijkstra vs A* Search heuristic admissibility',
          content: 'We are implementing shortest path finding in Artificial Intelligence Lab 2. Can someone from faculty or senior students explain why an inconsistent heuristic causes A* to revisit closed nodes?',
          category: 'studyQuestion',
          author: existingStudent._id,
          authorName: existingStudent.username,
          role: 'student',
          department: 'Computer Science',
          likes: [profYohannes._id, abebeTA._id],
          comments: [
            {
              user: abebeTA._id,
              username: 'Abebe T. (TA)',
              role: 'ta',
              text: 'If h(n) violates the triangle inequality, the first path found to a state is no longer guaranteed to be the shortest.',
              createdAt: new Date(Date.now() - 7200000)
            }
          ]
        },
        {
          title: 'Digital Signal Processing Slides & Matlab Code Repository',
          content: 'The complete set of Lecture Slides on Fourier Transforms, DFT formulas, and FFT algorithms is now updated in the university portal. Make sure to download the Matlab scripts before Thursday lab.',
          category: 'courseMaterial',
          author: drRahel._id,
          authorName: 'Dr. Rahel Mengistu',
          role: 'teacher',
          department: 'Electrical Engineering',
          likes: [existingStudent._id, abebeTA._id],
          comments: []
        }
      ]);
      console.log('Seeded real university posts in MongoDB');
    }

    // 3. Seed Real Stories if empty
    const storiesCount = await Story.countDocuments();
    if (storiesCount === 0) {
      await Story.create([
        {
          author: profYohannes._id,
          authorName: 'Prof. Yohannes K.',
          role: 'teacher',
          content: 'Distributed Systems midterm review worksheet is now live in the course files! Consult me during office hours today.',
          previewTitle: 'Midterm Worksheet',
          bgGradient: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)'
        },
        {
          author: drRahel._id,
          authorName: 'Dr. Rahel Mengistu',
          role: 'teacher',
          content: 'DSP Lab Bench 4 is open for practice this afternoon from 2:00 PM to 5:00 PM. All students welcome.',
          previewTitle: 'Open Lab Practice',
          bgGradient: 'linear-gradient(135deg, #065F46 0%, #10B981 100%)'
        },
        {
          author: abebeTA._id,
          authorName: 'Abebe T. (TA)',
          role: 'ta',
          content: 'Practice exam questions on Recursion Trees and Master Theorem are printed in Tech Hall Lab 3.',
          previewTitle: 'Practice Questions',
          bgGradient: 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)'
        }
      ]);
      console.log('Seeded real university stories in MongoDB');
    }

    // 4. Seed Real Shorts if empty
    const shortsCount = await Short.countDocuments();
    if (shortsCount === 0) {
      await Short.create([
        {
          title: '3-Minute Masterclass: Fast Matrix Multiplication for AI',
          description: 'Breakdown of Strassen algorithm vs standard O(n^3) matrix multiplication. Vital for university exam preparation and neural networks!',
          author: profYohannes._id,
          authorName: 'Prof. Yohannes K.',
          role: 'teacher',
          department: 'Computer Science',
          views: 342,
          soundTrack: 'Faculty Lecture Series Vol. 4',
          bgGradient: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
          videoCodeSnippet: 'C[i][j] = sum(A[i][k] * B[k][j])\n// Strassen recursive submatrices\nM1 = (A11 + A22) * (B11 + B22)\nM2 = (A21 + A22) * B11\nComplexity reduced to O(n^2.807) [Optimal]',
          likes: [existingStudent._id],
          comments: [
            {
              user: existingStudent._id,
              username: existingStudent.username,
              role: 'student',
              text: 'Will this question appear in Monday midterm exam?',
              createdAt: new Date()
            }
          ]
        },
        {
          title: 'Wollo University Lab: Digital Signal Processing Oscilloscope Demo',
          description: 'Capturing sinusoidal interference and configuring low-pass Butterworth filters on Lab Bench 4. Check out the noise attenuation!',
          author: drRahel._id,
          authorName: 'Dr. Rahel Mengistu',
          role: 'teacher',
          department: 'Electrical Engineering',
          views: 289,
          soundTrack: 'Lab Bench 4 Audio Log',
          bgGradient: 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)',
          videoCodeSnippet: 'H(s) = 1 / (s^2 + sqrt(2)*s + 1)\nfc = 2.4 kHz Cutoff Frequency\nSignal-to-Noise Ratio: +18 dB Gain',
          likes: [profYohannes._id],
          comments: []
        }
      ]);
      console.log('Seeded real university shorts in MongoDB');
    }

    // 5. Seed Real Study Pods if empty
    const podsCount = await Pod.countDocuments();
    if (podsCount === 0) {
      await Pod.create([
        {
          name: 'CS Year 3: Distributed Systems & Cloud',
          topic: 'Consensus Algorithms & Raft Election Practical Review',
          host: profYohannes._id,
          hostName: 'Prof. Yohannes K.',
          hostRole: 'teacher',
          membersCount: 14,
          status: 'live',
          type: 'video'
        },
        {
          name: 'Faculty Q&A Consultation Lounge',
          topic: 'Open Office Hours: DSP Lab 4 Inquiries & Filter Design',
          host: drRahel._id,
          hostName: 'Dr. Rahel Mengistu',
          hostRole: 'teacher',
          membersCount: 6,
          status: 'live',
          type: 'video'
        },
        {
          name: 'Freshman Engineering Mathematics I',
          topic: 'Integration by Parts & Substitution Worksheets',
          host: abebeTA._id,
          hostName: 'Abebe T. (TA)',
          hostRole: 'ta',
          membersCount: 22,
          status: 'live',
          type: 'audio'
        }
      ]);
      console.log('Seeded real study pods in MongoDB');
    }

    // 6. Seed real welcome messages between faculty and student if none exist
    const messagesCount = await Message.countDocuments();
    if (messagesCount === 0 && existingStudent) {
      await Message.create([
        {
          sender: profYohannes._id,
          receiver: existingStudent._id,
          content: 'Hello! Welcome to Wollo University Tea Team Chat. Feel free to ask questions about your coursework or office hours.',
          messageType: 'text',
          status: 'delivered',
          createdAt: new Date(Date.now() - 86400000)
        },
        {
          sender: existingStudent._id,
          receiver: profYohannes._id,
          content: 'Thank you Professor! I will review the Distributed Systems syllabus and attend Wednesday consultation hours.',
          messageType: 'text',
          status: 'read',
          createdAt: new Date(Date.now() - 43200000)
        }
      ]);
      console.log('Seeded real welcome messages in MongoDB');
    }

  } catch (error) {
    console.error('Error seeding real data in MongoDB:', error.message);
  }
};

module.exports = seedRealData;
