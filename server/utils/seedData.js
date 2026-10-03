const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const { matchSkills } = require('../services/skillMatcherService');

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerconnect';
    await mongoose.connect(mongoUri);
    console.log('🍃 Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Notification.deleteMany({});
    console.log('🧹 Cleared existing database records.');

    // 1. Create Admin User
    const admin = await User.create({
      name: 'Dr. Rajesh Sharma',
      email: 'admin@careerconnect.demo',
      password: 'password123',
      role: 'admin',
      phone: '+91 9876543210',
    });

    // 2. Create Recruiters
    const recruiter1 = await User.create({
      name: 'Ananya Verma',
      email: 'recruiter@careerconnect.demo',
      password: 'password123',
      role: 'recruiter',
      phone: '+91 9876543211',
    });

    const recruiter2 = await User.create({
      name: 'Vikram Mehta',
      email: 'vikram.recruiter@techcorp.demo',
      password: 'password123',
      role: 'recruiter',
      phone: '+91 9876543212',
    });

    const recruiter3 = await User.create({
      name: 'Sara Khan',
      email: 'sara.recruiter@cloudworks.demo',
      password: 'password123',
      role: 'recruiter',
      phone: '+91 9876543213',
    });

    // 3. Create Companies
    const company1 = await Company.create({
      name: 'TechCorp Solutions',
      description: 'Leading provider of enterprise cloud applications and software engineering services.',
      website: 'https://techcorp.example.com',
      industry: 'Software & Technology',
      location: 'Bengaluru, India',
      recruiter: recruiter1._id,
    });

    const company2 = await Company.create({
      name: 'CloudWorks Systems',
      description: 'Next-generation DevOps and cloud infrastructure management platform.',
      website: 'https://cloudworks.example.com',
      industry: 'Cloud Infrastructure',
      location: 'Pune, India',
      recruiter: recruiter2._id,
    });

    const company3 = await Company.create({
      name: 'DataPulse Analytics',
      description: 'AI-driven data intelligence and decision analytics suite.',
      website: 'https://datapulse.example.com',
      industry: 'Data & Analytics',
      location: 'Hyderabad, India',
      recruiter: recruiter3._id,
    });

    const company4 = await Company.create({
      name: 'FinEdge Innovations',
      description: 'Fintech software empowering modern digital payments and banking infrastructure.',
      website: 'https://finedge.example.com',
      industry: 'Financial Technology',
      location: 'Mumbai, India',
      recruiter: recruiter1._id,
    });

    const company5 = await Company.create({
      name: 'CyberShield Systems',
      description: 'Cybersecurity defense solutions and threat monitoring tools.',
      website: 'https://cybershield.example.com',
      industry: 'Cybersecurity',
      location: 'Gurugram, India',
      recruiter: recruiter2._id,
    });

    // 4. Create Students & Student Profiles
    const studentsData = [
      {
        name: 'Gayatri Patel',
        email: 'student@careerconnect.demo',
        password: 'password123',
        department: 'Information Technology',
        cgpa: 8.8,
        graduationYear: 2026,
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'Tailwind CSS'],
        about: 'Enthusiastic 3rd year B.Tech IT student with strong full-stack web development skills in MERN stack.',
        resumeUrl: 'https://example.com/resumes/gayatri_patel_resume.pdf',
        githubUrl: 'https://github.com/gayatripatel',
        linkedinUrl: 'https://linkedin.com/in/gayatripatel',
      },
      {
        name: 'Aarav Gupta',
        email: 'aarav.student@demo.com',
        password: 'password123',
        department: 'Computer Engineering',
        cgpa: 9.1,
        graduationYear: 2026,
        skills: ['Python', 'Java', 'C++', 'Data Structures', 'SQL', 'Docker', 'AWS'],
        about: 'Computer engineering student passionate about scalable backend architecture and cloud computing.',
        resumeUrl: 'https://example.com/resumes/aarav_gupta_resume.pdf',
        githubUrl: 'https://github.com/aaravgupta',
        linkedinUrl: 'https://linkedin.com/in/aaravgupta',
      },
      {
        name: 'Riya Sen',
        email: 'riya.student@demo.com',
        password: 'password123',
        department: 'Information Technology',
        cgpa: 8.2,
        graduationYear: 2026,
        skills: ['JavaScript', 'React', 'HTML/CSS', 'UI/UX Design', 'Figma', 'Git'],
        about: 'Frontend developer with an eye for UI design and interactive web user experiences.',
        resumeUrl: 'https://example.com/resumes/riya_sen_resume.pdf',
        githubUrl: 'https://github.com/riyasen',
        linkedinUrl: 'https://linkedin.com/in/riyasen',
      },
      {
        name: 'Rohan Joshi',
        email: 'rohan.student@demo.com',
        password: 'password123',
        department: 'Electronics & Communication',
        cgpa: 7.9,
        graduationYear: 2026,
        skills: ['Python', 'SQL', 'MongoDB', 'Node.js', 'Express', 'Docker'],
        about: 'ECE student transitioning to full stack development with focus on REST APIs and backend systems.',
        resumeUrl: 'https://example.com/resumes/rohan_joshi_resume.pdf',
        githubUrl: 'https://github.com/rohanjoshi',
        linkedinUrl: 'https://linkedin.com/in/rohanjoshi',
      },
      {
        name: 'Sneha Kulkarni',
        email: 'sneha.student@demo.com',
        password: 'password123',
        department: 'Computer Engineering',
        cgpa: 9.4,
        graduationYear: 2026,
        skills: ['Java', 'Spring Boot', 'SQL', 'PostgreSQL', 'Microservices', 'Git'],
        about: 'High-performing CS undergrad specializing in Java enterprise systems and database optimization.',
        resumeUrl: 'https://example.com/resumes/sneha_kulkarni_resume.pdf',
        githubUrl: 'https://github.com/snehakulkarni',
        linkedinUrl: 'https://linkedin.com/in/snehakulkarni',
      },
    ];

    const studentUsers = [];
    const studentProfiles = [];

    for (const sData of studentsData) {
      const user = await User.create({
        name: sData.name,
        email: sData.email,
        password: sData.password,
        role: 'student',
      });
      studentUsers.push(user);

      const profile = await StudentProfile.create({
        user: user._id,
        department: sData.department,
        degree: 'B.Tech',
        graduationYear: sData.graduationYear,
        cgpa: sData.cgpa,
        about: sData.about,
        skills: sData.skills,
        resumeUrl: sData.resumeUrl,
        githubUrl: sData.githubUrl,
        linkedinUrl: sData.linkedinUrl,
        projects: [
          {
            title: 'Full-Stack E-Commerce Platform',
            description: 'Built a responsive online platform with user authentication, shopping cart, and online payments.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
            githubUrl: sData.githubUrl,
          },
        ],
        education: [
          {
            institution: 'Government Engineering College',
            degree: 'B.Tech',
            fieldOfStudy: sData.department,
            startYear: 2022,
            endYear: 2026,
            grade: `${sData.cgpa} CGPA`,
          },
        ],
      });
      studentProfiles.push(profile);
    }

    // 5. Create Jobs
    const jobsData = [
      {
        title: 'Full Stack Software Engineer Intern',
        company: company1._id,
        description: 'Join TechCorp Solutions to build next-generation enterprise web applications using React, Node.js, and MongoDB.',
        responsibilities: [
          'Develop reusable React components',
          'Design RESTful APIs using Express.js',
          'Participate in agile sprint ceremonies',
        ],
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Docker', 'Git'],
        location: 'Bengaluru',
        workMode: 'Hybrid',
        jobType: 'Internship',
        salary: '₹35,000 / month',
        minCGPA: 8.0,
        eligibleDepartments: ['Information Technology', 'Computer Engineering'],
        graduationYears: [2026],
        openings: 5,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        createdBy: recruiter1._id,
        approvedBy: admin._id,
      },
      {
        title: 'Frontend Developer',
        company: company1._id,
        description: 'Looking for a skilled frontend developer to create high-performance web applications with React and Tailwind CSS.',
        responsibilities: [
          'Translate Figma designs into responsive React interfaces',
          'Optimize web performance and accessibility',
        ],
        requiredSkills: ['JavaScript', 'React', 'Tailwind CSS', 'HTML/CSS', 'Git'],
        location: 'Bengaluru',
        workMode: 'Remote',
        jobType: 'Full Time',
        salary: '₹8.5 - 11 LPA',
        minCGPA: 7.5,
        eligibleDepartments: ['Information Technology', 'Computer Engineering', 'Electronics & Communication'],
        graduationYears: [2026],
        openings: 3,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'active',
        createdBy: recruiter1._id,
        approvedBy: admin._id,
      },
      {
        title: 'Cloud & DevOps Engineer Intern',
        company: company2._id,
        description: 'Work with our CloudWorks team to deploy, monitor, and automate AWS infrastructure and CI/CD pipelines.',
        responsibilities: [
          'Write Infrastructure as Code scripts',
          'Set up Docker containerized environments and Kubernetes clusters',
        ],
        requiredSkills: ['Docker', 'AWS', 'Python', 'Linux', 'Git', 'CI/CD'],
        location: 'Pune',
        workMode: 'On-site',
        jobType: 'Internship',
        salary: '₹30,000 / month',
        minCGPA: 8.0,
        eligibleDepartments: ['Computer Engineering', 'Information Technology'],
        graduationYears: [2026],
        openings: 4,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: 'active',
        createdBy: recruiter2._id,
        approvedBy: admin._id,
      },
      {
        title: 'Backend API Engineer',
        company: company3._id,
        description: 'DataPulse Analytics is seeking a backend developer proficient in Python, SQL, and database management.',
        responsibilities: [
          'Design scalable microservices and REST APIs',
          'Optimize database queries and caching layers',
        ],
        requiredSkills: ['Python', 'SQL', 'PostgreSQL', 'Docker', 'REST APIs'],
        location: 'Hyderabad',
        workMode: 'Hybrid',
        jobType: 'Full Time',
        salary: '₹10 - 14 LPA',
        minCGPA: 7.5,
        eligibleDepartments: ['Computer Engineering', 'Information Technology'],
        graduationYears: [2026],
        openings: 2,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: 'active',
        createdBy: recruiter3._id,
        approvedBy: admin._id,
      },
      {
        title: 'Java Backend Developer',
        company: company4._id,
        description: 'FinEdge Innovations is hiring Java developers to build secure transaction processing systems.',
        responsibilities: [
          'Develop Spring Boot microservices',
          'Ensure high throughput and data encryption standards',
        ],
        requiredSkills: ['Java', 'Spring Boot', 'SQL', 'Microservices', 'Git'],
        location: 'Mumbai',
        workMode: 'On-site',
        jobType: 'Full Time',
        salary: '₹12 LPA',
        minCGPA: 8.5,
        eligibleDepartments: ['Computer Engineering', 'Information Technology'],
        graduationYears: [2026],
        openings: 6,
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        status: 'active',
        createdBy: recruiter1._id,
        approvedBy: admin._id,
      },
      {
        title: 'Cybersecurity Associate Analyst',
        company: company5._id,
        description: 'Monitor network traffic, perform vulnerability assessments, and safeguard cloud workloads.',
        responsibilities: [
          'Conduct penetration testing and security audits',
          'Respond to security incidents',
        ],
        requiredSkills: ['Cybersecurity', 'Linux', 'Python', 'Networking'],
        location: 'Gurugram',
        workMode: 'On-site',
        jobType: 'Full Time',
        salary: '₹9 LPA',
        minCGPA: 7.5,
        eligibleDepartments: ['Information Technology', 'Computer Engineering', 'Electronics & Communication'],
        graduationYears: [2026],
        openings: 2,
        deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        status: 'active',
        createdBy: recruiter2._id,
        approvedBy: admin._id,
      },
    ];

    const jobs = await Job.insertMany(jobsData);

    // 6. Create Applications & Notifications
    const applicationStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'];

    let count = 0;
    for (let i = 0; i < studentUsers.length; i++) {
      const studentUser = studentUsers[i];
      const studentProf = studentProfiles[i];

      for (let j = 0; j < jobs.length; j++) {
        // Create 2-3 applications per student
        if ((i + j) % 2 === 0) {
          const targetJob = jobs[j];
          const matchResult = matchSkills(studentProf.skills, targetJob.requiredSkills);
          const assignedStatus = applicationStatuses[count % applicationStatuses.length];

          const app = await Application.create({
            student: studentUser._id,
            job: targetJob._id,
            resumeUrl: studentProf.resumeUrl,
            matchScore: matchResult.matchScore,
            matchedSkills: matchResult.matchedSkills,
            missingSkills: matchResult.missingSkills,
            status: assignedStatus,
          });

          // Create notification for student
          await Notification.create({
            recipient: studentUser._id,
            sender: recruiter1._id,
            type: 'application_status',
            title: `Application Status Updated - ${targetJob.title}`,
            message: `Your application status for ${targetJob.title} at TechCorp is now "${assignedStatus}".`,
            relatedJob: targetJob._id,
            relatedApplication: app._id,
          });

          count++;
        }
      }
    }

    console.log(`✅ Database Seeded Successfully!`);
    console.log(`--------------------------------------------------`);
    console.log(`Admin Login: admin@careerconnect.demo / password123`);
    console.log(`Recruiter Login: recruiter@careerconnect.demo / password123`);
    console.log(`Student Login: student@careerconnect.demo / password123`);
    console.log(`--------------------------------------------------`);

    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
