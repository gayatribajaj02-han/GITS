const Job = require('../models/Job');
const Company = require('../models/Company');
const User = require('../models/User');

/**
 * Clean HTML tags from API description strings
 */
const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * Map API tags/keywords into clean technical skill arrays
 */
const extractSkillsFromJob = (title, description, tags = []) => {
  const commonTech = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB',
    'Python', 'Java', 'C++', 'Rust', 'Docker', 'AWS', 'Kubernetes', 'Linux',
    'SQL', 'PostgreSQL', 'Tailwind CSS', 'HTML/CSS', 'Git', 'CI/CD',
    'Cybersecurity', 'REST APIs', 'Spring Boot', 'Microservices', 'GraphQL',
    'UI/UX Design', 'DevOps', 'Data Science', 'Machine Learning'
  ];

  const foundSkills = new Set();

  tags.forEach(t => {
    if (typeof t === 'string' && t.length < 30) {
      foundSkills.add(t.trim());
    }
  });

  const fullText = `${title} ${description}`.toLowerCase();

  commonTech.forEach(tech => {
    const cleanTech = tech.toLowerCase();
    if (fullText.includes(cleanTech)) {
      foundSkills.add(tech);
    }
  });

  const resultArray = Array.from(foundSkills);
  return resultArray.length > 0 ? resultArray.slice(0, 8) : ['Software Engineering', 'JavaScript', 'Git'];
};

/**
 * Ingest live developer jobs from public market APIs into MongoDB
 */
const fetchAndIngestMarketJobs = async () => {
  try {
    console.log('📡 Fetching live market tech jobs from global APIs...');

    // Find or create System Recruiter for Market Jobs
    let systemRecruiter = await User.findOne({ role: 'recruiter' });
    if (!systemRecruiter) {
      systemRecruiter = await User.create({
        name: 'Global Tech Recruitment Bot',
        email: 'bot.recruiter@careerconnect.demo',
        password: 'password123',
        role: 'recruiter',
      });
    }

    const newJobsIngested = [];
    const requestHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
    };

    // Source 1: Arbeitnow Public Developer Jobs API
    try {
      const response = await fetch('https://arbeitnow.com/api/job-board-api', { headers: requestHeaders });
      if (response.ok) {
        const data = await response.json();
        const rawJobs = data?.data || [];

        for (const item of rawJobs.slice(0, 10)) {
          if (!item.title || !item.company_name) continue;

          const companyName = item.company_name.trim();
          let company = await Company.findOne({ name: companyName });

          if (!company) {
            company = await Company.create({
              name: companyName,
              description: `${companyName} is a global technology company hiring software engineering talent.`,
              website: item.url || `https://${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.example.com`,
              industry: 'Software & Technology',
              location: item.location || 'Remote / Hybrid',
              recruiter: systemRecruiter._id,
            });
          }

          const cleanDesc = stripHtml(item.description).slice(0, 500) + '...';
          const skills = extractSkillsFromJob(item.title, item.description, item.tags || []);

          const existingJob = await Job.findOne({ title: item.title, company: company._id });

          if (!existingJob) {
            const createdJob = await Job.create({
              title: item.title,
              company: company._id,
              description: cleanDesc,
              responsibilities: [
                'Develop and maintain high quality scalable codebase',
                'Participate in code reviews and architectural discussions',
                'Collaborate with cross-functional product teams',
              ],
              requiredSkills: skills,
              location: item.location || 'Remote',
              workMode: item.remote ? 'Remote' : 'Hybrid',
              jobType: 'Full Time',
              salary: '₹12 - 18 LPA ($75k - $110k)',
              minCGPA: 7.0,
              eligibleDepartments: ['Information Technology', 'Computer Engineering', 'Electronics & Communication'],
              openings: Math.floor(Math.random() * 5) + 2,
              deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
              status: 'active',
              createdBy: systemRecruiter._id,
            });

            newJobsIngested.push(createdJob);
          }
        }
      }
    } catch (err) {
      console.warn('⚠️ Arbeitnow API fetch skipped/failed:', err.message);
    }

    // Source 2: Remotive Public Tech Jobs API
    try {
      const remotiveResp = await fetch('https://remotive.com/api/remote-jobs?category=software-dev&limit=8', { headers: requestHeaders });
      if (remotiveResp.ok) {
        const remotiveData = await remotiveResp.json();
        const remotiveJobs = remotiveData?.jobs || [];

        for (const item of remotiveJobs.slice(0, 8)) {
          if (!item.title || !item.company_name) continue;

          const companyName = item.company_name.trim();
          let company = await Company.findOne({ name: companyName });

          if (!company) {
            company = await Company.create({
              name: companyName,
              description: `${companyName} hires top remote software engineers globally.`,
              website: item.url || `https://${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
              industry: 'Software Development',
              location: item.candidate_required_location || 'Global Remote',
              recruiter: systemRecruiter._id,
            });
          }

          const cleanDesc = stripHtml(item.description).slice(0, 500) + '...';
          const skills = extractSkillsFromJob(item.title, item.description, item.tags || []);

          const existingJob = await Job.findOne({ title: item.title, company: company._id });

          if (!existingJob) {
            const createdJob = await Job.create({
              title: item.title,
              company: company._id,
              description: cleanDesc,
              responsibilities: [
                'Design scalable cloud infrastructure and APIs',
                'Build interactive web application user interfaces',
                'Perform automated unit and integration testing',
              ],
              requiredSkills: skills,
              location: item.candidate_required_location || 'Remote',
              workMode: 'Remote',
              jobType: item.job_type === 'full_time' ? 'Full Time' : 'Internship',
              salary: item.salary || '₹14 - 22 LPA ($85k - $120k)',
              minCGPA: 7.5,
              eligibleDepartments: ['Information Technology', 'Computer Engineering'],
              openings: Math.floor(Math.random() * 4) + 2,
              deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
              status: 'active',
              createdBy: systemRecruiter._id,
            });

            newJobsIngested.push(createdJob);
          }
        }
      }
    } catch (err) {
      console.warn('⚠️ Remotive API fetch skipped/failed:', err.message);
    }

    // Source 3: Backup Curated High-Value Global Market Developer Jobs (Guarantees fresh tech jobs)
    if (newJobsIngested.length === 0) {
      const curatedMarketJobs = [
        {
          title: 'Senior Full Stack Software Engineer (React & Node.js)',
          companyName: 'Vercel Labs',
          description: 'Build high-performance web applications and serverless deployment tools using Next.js, React, Node.js, and TypeScript.',
          skills: ['React', 'Node.js', 'TypeScript', 'Next.js', 'Tailwind CSS', 'REST APIs', 'Git'],
          location: 'Remote / Global',
          workMode: 'Remote',
          jobType: 'Full Time',
          salary: '₹18 - 28 LPA ($95k - $140k)',
          minCGPA: 7.5,
        },
        {
          title: 'DevOps & Cloud Infrastructure Engineer',
          companyName: 'Datadog Tech',
          description: 'Architect scalable Kubernetes clusters, Docker container pipelines, AWS cloud infrastructure, and CI/CD automated deployment workflows.',
          skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Python', 'DevOps'],
          location: 'Bengaluru / Hybrid',
          workMode: 'Hybrid',
          jobType: 'Full Time',
          salary: '₹16 - 25 LPA ($85k - $130k)',
          minCGPA: 7.0,
        },
        {
          title: 'Backend Systems & Microservices Developer',
          companyName: 'Stripe Payments',
          description: 'Design resilient microservice APIs, payment processing engine, and distributed database models in Java, Spring Boot, and PostgreSQL.',
          skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'REST APIs', 'Docker', 'Git'],
          location: 'Remote / India',
          workMode: 'Remote',
          jobType: 'Full Time',
          salary: '₹20 - 32 LPA ($100k - $150k)',
          minCGPA: 8.0,
        },
        {
          title: 'AI & Data Science Software Engineer',
          companyName: 'OpenAI Partner Labs',
          description: 'Develop machine learning data pipelines, Large Language Model integrations, Python data processing, and predictive analytics API endpoints.',
          skills: ['Python', 'Machine Learning', 'Data Science', 'REST APIs', 'SQL', 'Git'],
          location: 'Hybrid / Remote',
          workMode: 'Hybrid',
          jobType: 'Full Time',
          salary: '₹22 - 35 LPA ($110k - $160k)',
          minCGPA: 8.0,
        },
        {
          title: 'Frontend React UI Developer Intern',
          companyName: 'Figma Systems',
          description: 'Build responsive, accessible, interactive web UI components with React, Tailwind CSS, Lucide Icons, and modern web state management.',
          skills: ['React', 'JavaScript', 'Tailwind CSS', 'UI/UX Design', 'HTML/CSS', 'Git'],
          location: 'Remote',
          workMode: 'Remote',
          jobType: 'Internship',
          salary: '₹40,000 / month ($1,200/mo)',
          minCGPA: 7.0,
        },
      ];

      for (const item of curatedMarketJobs) {
        let company = await Company.findOne({ name: item.companyName });
        if (!company) {
          company = await Company.create({
            name: item.companyName,
            description: `${item.companyName} is a global tech company hiring software engineering talent.`,
            website: `https://${item.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
            industry: 'Software & Technology',
            location: item.location,
            recruiter: systemRecruiter._id,
          });
        }

        const existingJob = await Job.findOne({ title: item.title, company: company._id });

        if (!existingJob) {
          const createdJob = await Job.create({
            title: item.title,
            company: company._id,
            description: item.description,
            responsibilities: [
              'Design and deliver high-performance production code',
              'Participate in agile sprint planning and technical design reviews',
              'Optimize database queries and RESTful API endpoints',
            ],
            requiredSkills: item.skills,
            location: item.location,
            workMode: item.workMode,
            jobType: item.jobType,
            salary: item.salary,
            minCGPA: item.minCGPA,
            eligibleDepartments: ['Information Technology', 'Computer Engineering', 'Electronics & Communication'],
            openings: Math.floor(Math.random() * 4) + 2,
            deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
            status: 'active',
            createdBy: systemRecruiter._id,
          });

          newJobsIngested.push(createdJob);
        }
      }
    }

    console.log(`✅ Ingested ${newJobsIngested.length} new live market jobs into MongoDB!`);
    return {
      success: true,
      count: newJobsIngested.length,
      jobs: newJobsIngested,
    };
  } catch (error) {
    console.error('❌ Market Job Ingestion Error:', error.message);
    throw error;
  }
};

module.exports = {
  fetchAndIngestMarketJobs,
};
