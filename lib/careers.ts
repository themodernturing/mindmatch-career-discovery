import { Career } from './types'

export const careers: Career[] = [
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    category: 'Technology',
    description: 'Designs, develops, and maintains software applications and systems. Solves complex problems through code and collaborates with teams to build digital products.',
    typical_tasks: [
      'Write and debug code in programming languages',
      'Design software architecture and systems',
      'Collaborate with product managers and designers',
      'Test and maintain software applications',
      'Research new technologies and methodologies'
    ],
    required_skills: [
      { name: 'Programming (Python, Java, JavaScript)', importance: 'essential', category: 'technical' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' },
      { name: 'Logical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Collaboration', importance: 'important', category: 'soft' },
      { name: 'Continuous learning', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Computer Science, Software Engineering', duration: '4 years' },
      { level: 'certificate', field: 'Coding Bootcamp', duration: '3-6 months' }
    ],
    riasec_profile: { realistic: 35, investigative: 85, artistic: 45, social: 30, enterprising: 40, conventional: 55 },
    salary_range: { entry: 65000, median: 110000, experienced: 180000 },
    outlook: { growth: 'rapidly_growing', demand: 'very_high' }
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    category: 'Technology',
    description: 'Analyzes complex data sets to identify patterns, build predictive models, and extract insights that drive business decisions.',
    typical_tasks: [
      'Collect and clean large datasets',
      'Build statistical models and machine learning algorithms',
      'Visualize data and communicate findings',
      'Collaborate with business stakeholders',
      'Research new analytical methods'
    ],
    required_skills: [
      { name: 'Statistics and mathematics', importance: 'essential', category: 'technical' },
      { name: 'Programming (Python, R, SQL)', importance: 'essential', category: 'technical' },
      { name: 'Machine learning', importance: 'important', category: 'technical' },
      { name: 'Critical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Communication', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'master', field: 'Data Science, Statistics', duration: '2 years' },
      { level: 'bachelor', field: 'Mathematics, Statistics, Computer Science', duration: '4 years' }
    ],
    riasec_profile: { realistic: 25, investigative: 95, artistic: 35, social: 30, enterprising: 40, conventional: 60 },
    salary_range: { entry: 75000, median: 120000, experienced: 180000 },
    outlook: { growth: 'rapidly_growing', demand: 'very_high' }
  },
  {
    id: 'ux-designer',
    name: 'UX/UI Designer',
    category: 'Technology',
    description: 'Designs user experiences and interfaces for digital products. Combines user research, visual design, and interaction design to create intuitive products.',
    typical_tasks: [
      'Conduct user research and usability testing',
      'Create wireframes and prototypes',
      'Design visual interfaces and interactions',
      'Collaborate with developers and product managers',
      'Iterate designs based on feedback'
    ],
    required_skills: [
      { name: 'User research', importance: 'essential', category: 'technical' },
      { name: 'Visual design', importance: 'essential', category: 'technical' },
      { name: 'Prototyping tools (Figma, Sketch)', importance: 'essential', category: 'technical' },
      { name: 'Empathy for users', importance: 'essential', category: 'soft' },
      { name: 'Communication', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Human-Computer Interaction, Design', duration: '4 years' },
      { level: 'certificate', field: 'UX/UI Design Bootcamp', duration: '3-6 months' }
    ],
    riasec_profile: { realistic: 25, investigative: 55, artistic: 85, social: 60, enterprising: 40, conventional: 35 },
    salary_range: { entry: 60000, median: 95000, experienced: 150000 },
    outlook: { growth: 'rapidly_growing', demand: 'very_high' }
  },
  {
    id: 'psychologist',
    name: 'Psychologist',
    category: 'Healthcare',
    description: 'Studies human behavior and mental processes. Provides therapy, conducts research, and helps individuals improve their mental health and well-being.',
    typical_tasks: [
      'Conduct therapy sessions with clients',
      'Administer and interpret psychological assessments',
      'Develop treatment plans',
      'Research human behavior and mental health',
      'Write reports and maintain client records'
    ],
    required_skills: [
      { name: 'Active listening', importance: 'essential', category: 'soft' },
      { name: 'Empathy and compassion', importance: 'essential', category: 'soft' },
      { name: 'Research methods', importance: 'essential', category: 'technical' },
      { name: 'Critical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Communication', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'doctorate', field: 'Clinical Psychology, Counseling Psychology', duration: '4-6 years' },
      { level: 'master', field: 'Psychology, Counseling', duration: '2-3 years' }
    ],
    riasec_profile: { realistic: 20, investigative: 75, artistic: 40, social: 95, enterprising: 30, conventional: 50 },
    salary_range: { entry: 55000, median: 85000, experienced: 140000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'teacher',
    name: 'High School Teacher',
    category: 'Education',
    description: 'Educates and mentors students in specific subject areas. Develops curriculum, assesses learning, and supports student development.',
    typical_tasks: [
      'Plan and deliver lessons',
      'Assess student progress and provide feedback',
      'Manage classroom behavior',
      'Collaborate with parents and colleagues',
      'Participate in professional development'
    ],
    required_skills: [
      { name: 'Subject matter expertise', importance: 'essential', category: 'technical' },
      { name: 'Communication', importance: 'essential', category: 'soft' },
      { name: 'Patience and empathy', importance: 'essential', category: 'soft' },
      { name: 'Classroom management', importance: 'essential', category: 'soft' },
      { name: 'Adaptability', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Education or subject-specific', duration: '4 years' }
    ],
    riasec_profile: { realistic: 25, investigative: 50, artistic: 45, social: 95, enterprising: 55, conventional: 60 },
    salary_range: { entry: 42000, median: 62000, experienced: 85000 },
    outlook: { growth: 'stable', demand: 'moderate' }
  },
  {
    id: 'marketing-manager',
    name: 'Marketing Manager',
    category: 'Business',
    description: 'Plans and executes marketing strategies to promote products or services. Leads teams, analyzes markets, and drives brand growth.',
    typical_tasks: [
      'Develop marketing strategies and campaigns',
      'Lead and manage marketing teams',
      'Analyze market trends and consumer behavior',
      'Manage marketing budgets and ROI',
      'Collaborate with sales and product teams'
    ],
    required_skills: [
      { name: 'Strategic thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Leadership', importance: 'essential', category: 'soft' },
      { name: 'Data analysis', importance: 'important', category: 'technical' },
      { name: 'Communication', importance: 'essential', category: 'soft' },
      { name: 'Creativity', importance: 'important', category: 'cognitive' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Marketing, Business Administration', duration: '4 years' },
      { level: 'master', field: 'MBA, Marketing', duration: '2 years' }
    ],
    riasec_profile: { realistic: 20, investigative: 45, artistic: 55, social: 70, enterprising: 90, conventional: 50 },
    salary_range: { entry: 55000, median: 95000, experienced: 150000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'mechanical-engineer',
    name: 'Mechanical Engineer',
    category: 'Engineering',
    description: 'Designs, develops, and tests mechanical devices and systems. Applies physics and materials science principles to solve engineering problems.',
    typical_tasks: [
      'Design mechanical systems and components',
      'Create and test prototypes',
      'Analyze performance data and troubleshoot issues',
      'Collaborate with manufacturing teams',
      'Ensure designs meet safety standards'
    ],
    required_skills: [
      { name: 'CAD software (SolidWorks, AutoCAD)', importance: 'essential', category: 'technical' },
      { name: 'Mathematics and physics', importance: 'essential', category: 'technical' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' },
      { name: 'Technical drawing', importance: 'important', category: 'technical' },
      { name: 'Project management', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Mechanical Engineering', duration: '4 years' }
    ],
    riasec_profile: { realistic: 80, investigative: 75, artistic: 25, social: 30, enterprising: 35, conventional: 50 },
    salary_range: { entry: 65000, median: 95000, experienced: 140000 },
    outlook: { growth: 'stable', demand: 'moderate' }
  },
  {
    id: 'nurse',
    name: 'Registered Nurse',
    category: 'Healthcare',
    description: 'Provides patient care, educates patients about health conditions, and offers emotional support to patients and families.',
    typical_tasks: [
      'Assess patient conditions and needs',
      'Administer medications and treatments',
      'Collaborate with doctors and healthcare team',
      'Educate patients and families',
      'Maintain accurate patient records'
    ],
    required_skills: [
      { name: 'Medical knowledge', importance: 'essential', category: 'technical' },
      { name: 'Empathy and compassion', importance: 'essential', category: 'soft' },
      { name: 'Critical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Communication', importance: 'essential', category: 'soft' },
      { name: 'Physical stamina', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Nursing (BSN)', duration: '4 years' },
      { level: 'associate', field: 'Nursing (ADN)', duration: '2 years' }
    ],
    riasec_profile: { realistic: 50, investigative: 55, artistic: 25, social: 95, enterprising: 35, conventional: 65 },
    salary_range: { entry: 55000, median: 80000, experienced: 110000 },
    outlook: { growth: 'rapidly_growing', demand: 'very_high' }
  },
  {
    id: 'graphic-designer',
    name: 'Graphic Designer',
    category: 'Creative',
    description: 'Creates visual concepts to communicate ideas that inspire, inform, and captivate consumers. Develops layouts and design for various media.',
    typical_tasks: [
      'Create visual designs for print and digital media',
      'Develop brand identity and logos',
      'Collaborate with clients and marketing teams',
      'Use design software (Adobe Creative Suite)',
      'Present design concepts to stakeholders'
    ],
    required_skills: [
      { name: 'Visual design', importance: 'essential', category: 'technical' },
      { name: 'Creativity', importance: 'essential', category: 'cognitive' },
      { name: 'Adobe Creative Suite', importance: 'essential', category: 'technical' },
      { name: 'Communication', importance: 'important', category: 'soft' },
      { name: 'Time management', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Graphic Design, Fine Arts', duration: '4 years' },
      { level: 'associate', field: 'Graphic Design', duration: '2 years' }
    ],
    riasec_profile: { realistic: 30, investigative: 25, artistic: 95, social: 40, enterprising: 45, conventional: 40 },
    salary_range: { entry: 42000, median: 65000, experienced: 100000 },
    outlook: { growth: 'stable', demand: 'moderate' }
  },
  {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    category: 'Business',
    description: 'Starts and manages new business ventures. Identifies opportunities, secures funding, builds teams, and navigates business challenges.',
    typical_tasks: [
      'Identify market opportunities and validate ideas',
      'Develop business plans and pitch to investors',
      'Build and lead founding teams',
      'Manage operations and finances',
      'Adapt strategy based on market feedback'
    ],
    required_skills: [
      { name: 'Risk tolerance', importance: 'essential', category: 'soft' },
      { name: 'Leadership', importance: 'essential', category: 'soft' },
      { name: 'Business acumen', importance: 'essential', category: 'technical' },
      { name: 'Resilience', importance: 'essential', category: 'soft' },
      { name: 'Networking', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Business, Engineering', duration: '4 years' }
    ],
    riasec_profile: { realistic: 40, investigative: 45, artistic: 60, social: 50, enterprising: 95, conventional: 35 },
    salary_range: { entry: 0, median: 75000, experienced: 250000 },
    outlook: { growth: 'growing', demand: 'moderate' }
  },
  {
    id: 'physician',
    name: 'Physician',
    category: 'Healthcare',
    description: 'Diagnoses and treats illnesses and injuries. Provides preventive care, prescribes medications, and improves patient health outcomes.',
    typical_tasks: [
      'Examine patients and diagnose conditions',
      'Develop treatment plans and prescribe medications',
      'Order and interpret diagnostic tests',
      'Collaborate with healthcare teams',
      'Maintain patient records and stay current with medical knowledge'
    ],
    required_skills: [
      { name: 'Medical knowledge', importance: 'essential', category: 'technical' },
      { name: 'Critical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Communication', importance: 'essential', category: 'soft' },
      { name: 'Empathy', importance: 'essential', category: 'soft' },
      { name: 'Decision-making under pressure', importance: 'essential', category: 'cognitive' }
    ],
    education_pathways: [
      { level: 'doctorate', field: 'Medicine (MD or DO)', duration: '4 years + residency' }
    ],
    riasec_profile: { realistic: 35, investigative: 85, artistic: 25, social: 85, enterprising: 40, conventional: 55 },
    salary_range: { entry: 200000, median: 250000, experienced: 400000 },
    outlook: { growth: 'growing', demand: 'very_high' }
  },
  {
    id: 'financial-analyst',
    name: 'Financial Analyst',
    category: 'Business',
    description: 'Analyzes financial data to help organizations make investment decisions. Evaluates economic trends, financial statements, and business performance.',
    typical_tasks: [
      'Analyze financial statements and data',
      'Create financial models and forecasts',
      'Evaluate investment opportunities',
      'Prepare reports and presentations',
      'Monitor economic and business trends'
    ],
    required_skills: [
      { name: 'Financial modeling', importance: 'essential', category: 'technical' },
      { name: 'Excel and data analysis', importance: 'essential', category: 'technical' },
      { name: 'Accounting knowledge', importance: 'essential', category: 'technical' },
      { name: 'Analytical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Attention to detail', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Finance, Accounting, Economics', duration: '4 years' },
      { level: 'master', field: 'MBA, Finance', duration: '2 years' }
    ],
    riasec_profile: { realistic: 20, investigative: 75, artistic: 20, social: 30, enterprising: 60, conventional: 85 },
    salary_range: { entry: 60000, median: 90000, experienced: 150000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'civil-engineer',
    name: 'Civil Engineer',
    category: 'Engineering',
    description: 'Designs, builds, and maintains infrastructure projects like roads, bridges, buildings, and water systems. Ensures public safety and environmental compliance.',
    typical_tasks: [
      'Design infrastructure projects',
      'Analyze survey reports and maps',
      'Ensure compliance with regulations',
      'Manage construction projects',
      'Assess environmental impact'
    ],
    required_skills: [
      { name: 'Engineering principles', importance: 'essential', category: 'technical' },
      { name: 'CAD software', importance: 'essential', category: 'technical' },
      { name: 'Project management', importance: 'important', category: 'soft' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' },
      { name: 'Attention to detail', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Civil Engineering', duration: '4 years' }
    ],
    riasec_profile: { realistic: 75, investigative: 65, artistic: 25, social: 35, enterprising: 45, conventional: 60 },
    salary_range: { entry: 60000, median: 88000, experienced: 130000 },
    outlook: { growth: 'stable', demand: 'moderate' }
  },
  {
    id: 'video-game-designer',
    name: 'Video Game Designer',
    category: 'Creative',
    description: 'Creates concepts, characters, stories, and gameplay mechanics for video games. Balances creative vision with technical constraints.',
    typical_tasks: [
      'Design game mechanics and systems',
      'Create storylines and characters',
      'Collaborate with artists and programmers',
      'Playtest and iterate on designs',
      'Write design documents and specifications'
    ],
    required_skills: [
      { name: 'Game design principles', importance: 'essential', category: 'technical' },
      { name: 'Creativity', importance: 'essential', category: 'cognitive' },
      { name: 'Storytelling', importance: 'important', category: 'soft' },
      { name: 'Technical understanding', importance: 'important', category: 'technical' },
      { name: 'Communication', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Game Design, Computer Science', duration: '4 years' }
    ],
    riasec_profile: { realistic: 35, investigative: 45, artistic: 90, social: 40, enterprising: 50, conventional: 30 },
    salary_range: { entry: 50000, median: 85000, experienced: 140000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'architect',
    name: 'Architect',
    category: 'Creative',
    description: 'Designs buildings and structures, balancing aesthetic vision with functional requirements and safety standards.',
    typical_tasks: [
      'Design buildings and prepare drawings',
      'Meet with clients to understand needs',
      'Collaborate with engineers and contractors',
      'Ensure designs meet codes and regulations',
      'Oversee construction progress'
    ],
    required_skills: [
      { name: 'Design ability', importance: 'essential', category: 'technical' },
      { name: 'CAD and BIM software', importance: 'essential', category: 'technical' },
      { name: 'Creativity', importance: 'essential', category: 'cognitive' },
      { name: 'Technical knowledge', importance: 'essential', category: 'technical' },
      { name: 'Communication', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'master', field: 'Architecture', duration: '5 years' }
    ],
    riasec_profile: { realistic: 50, investigative: 55, artistic: 90, social: 45, enterprising: 50, conventional: 45 },
    salary_range: { entry: 55000, median: 85000, experienced: 135000 },
    outlook: { growth: 'stable', demand: 'moderate' }
  },
  {
    id: 'electrician',
    name: 'Electrician',
    category: 'Trades',
    description: 'Installs, maintains, and repairs electrical systems in buildings and structures. Ensures safety and code compliance.',
    typical_tasks: [
      'Install wiring and electrical systems',
      'Troubleshoot electrical problems',
      'Read blueprints and technical diagrams',
      'Ensure compliance with electrical codes',
      'Maintain and repair electrical equipment'
    ],
    required_skills: [
      { name: 'Electrical systems knowledge', importance: 'essential', category: 'technical' },
      { name: 'Technical aptitude', importance: 'essential', category: 'technical' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' },
      { name: 'Physical dexterity', importance: 'important', category: 'technical' },
      { name: 'Attention to safety', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'high_school', field: 'Diploma + Apprenticeship', duration: '4-5 years' }
    ],
    riasec_profile: { realistic: 95, investigative: 50, artistic: 20, social: 30, enterprising: 40, conventional: 60 },
    salary_range: { entry: 40000, median: 60000, experienced: 95000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'physical-therapist',
    name: 'Physical Therapist',
    category: 'Healthcare',
    description: 'Helps patients recover mobility and manage pain after injuries or illnesses. Develops treatment plans and guides rehabilitation.',
    typical_tasks: [
      'Evaluate patient conditions and needs',
      'Develop treatment plans',
      'Guide patients through exercises',
      'Monitor progress and adjust treatments',
      'Educate patients and families'
    ],
    required_skills: [
      { name: 'Anatomy and physiology knowledge', importance: 'essential', category: 'technical' },
      { name: 'Empathy and patience', importance: 'essential', category: 'soft' },
      { name: 'Physical stamina', importance: 'essential', category: 'soft' },
      { name: 'Communication', importance: 'essential', category: 'soft' },
      { name: 'Problem-solving', importance: 'important', category: 'cognitive' }
    ],
    education_pathways: [
      { level: 'doctorate', field: 'Physical Therapy (DPT)', duration: '3 years' }
    ],
    riasec_profile: { realistic: 60, investigative: 50, artistic: 25, social: 95, enterprising: 35, conventional: 50 },
    salary_range: { entry: 65000, median: 95000, experienced: 120000 },
    outlook: { growth: 'rapidly_growing', demand: 'very_high' }
  },
  {
    id: 'management-consultant',
    name: 'Management Consultant',
    category: 'Business',
    description: 'Advises organizations on strategy, operations, and performance improvement. Analyzes problems and recommends solutions.',
    typical_tasks: [
      'Analyze client business problems',
      'Conduct research and data analysis',
      'Develop recommendations and strategies',
      'Present findings to executives',
      'Implement organizational changes'
    ],
    required_skills: [
      { name: 'Analytical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' },
      { name: 'Communication', importance: 'essential', category: 'soft' },
      { name: 'Business knowledge', importance: 'essential', category: 'technical' },
      { name: 'Presentation skills', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Business, Economics, Engineering', duration: '4 years' },
      { level: 'master', field: 'MBA', duration: '2 years' }
    ],
    riasec_profile: { realistic: 25, investigative: 70, artistic: 35, social: 65, enterprising: 85, conventional: 50 },
    salary_range: { entry: 75000, median: 120000, experienced: 200000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'school-counselor',
    name: 'School Counselor',
    category: 'Education',
    description: 'Supports students\' academic, career, and emotional development. Provides guidance, counseling, and resources to help students succeed.',
    typical_tasks: [
      'Provide individual and group counseling',
      'Help students with academic planning',
      'Support social and emotional development',
      'Collaborate with teachers and parents',
      'Connect students with resources and support services'
    ],
    required_skills: [
      { name: 'Active listening', importance: 'essential', category: 'soft' },
      { name: 'Empathy', importance: 'essential', category: 'soft' },
      { name: 'Communication', importance: 'essential', category: 'soft' },
      { name: 'Problem-solving', importance: 'important', category: 'cognitive' },
      { name: 'Organization', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'master', field: 'School Counseling', duration: '2-3 years' }
    ],
    riasec_profile: { realistic: 20, investigative: 45, artistic: 35, social: 95, enterprising: 45, conventional: 55 },
    salary_range: { entry: 45000, median: 62000, experienced: 85000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'investment-banker',
    name: 'Investment Banker',
    category: 'Business',
    description: 'Advises corporations and governments on financial transactions, including mergers, acquisitions, and capital raising.',
    typical_tasks: [
      'Build financial models and valuations',
      'Prepare pitch books and presentations',
      'Conduct due diligence',
      'Negotiate deal terms',
      'Advise clients on strategic decisions'
    ],
    required_skills: [
      { name: 'Financial modeling', importance: 'essential', category: 'technical' },
      { name: 'Excel proficiency', importance: 'essential', category: 'technical' },
      { name: 'Analytical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Communication', importance: 'essential', category: 'soft' },
      { name: 'Negotiation', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Finance, Economics, Business', duration: '4 years' },
      { level: 'master', field: 'MBA', duration: '2 years' }
    ],
    riasec_profile: { realistic: 20, investigative: 65, artistic: 25, social: 60, enterprising: 95, conventional: 70 },
    salary_range: { entry: 100000, median: 200000, experienced: 500000 },
    outlook: { growth: 'stable', demand: 'moderate' }
  },
  {
    id: 'ai-ml-engineer',
    name: 'AI / ML Engineer',
    category: 'Technology',
    description: 'Builds and trains machine learning models and AI systems. Develops algorithms that allow computers to learn from and make decisions based on data.',
    typical_tasks: [
      'Design and train machine learning models',
      'Build data pipelines and preprocessing systems',
      'Evaluate and improve model performance',
      'Deploy AI models to production',
      'Research new algorithms and techniques'
    ],
    required_skills: [
      { name: 'Python and ML frameworks (TensorFlow, PyTorch)', importance: 'essential', category: 'technical' },
      { name: 'Mathematics (linear algebra, calculus, statistics)', importance: 'essential', category: 'technical' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' },
      { name: 'Research ability', importance: 'important', category: 'cognitive' },
      { name: 'Critical thinking', importance: 'essential', category: 'cognitive' }
    ],
    education_pathways: [
      { level: 'master', field: 'Computer Science, AI, Data Science', duration: '2 years' },
      { level: 'bachelor', field: 'Computer Science, Mathematics', duration: '4 years' }
    ],
    riasec_profile: { realistic: 30, investigative: 95, artistic: 40, social: 25, enterprising: 45, conventional: 50 },
    salary_range: { entry: 80000, median: 140000, experienced: 220000 },
    outlook: { growth: 'rapidly_growing', demand: 'very_high' }
  },
  {
    id: 'cybersecurity-analyst',
    name: 'Cybersecurity Analyst',
    category: 'Technology',
    description: 'Protects computer systems and networks from digital threats. Monitors for attacks, investigates breaches, and builds secure systems.',
    typical_tasks: [
      'Monitor networks for security threats',
      'Investigate and respond to security incidents',
      'Conduct vulnerability assessments and penetration testing',
      'Develop security policies and procedures',
      'Train staff on security awareness'
    ],
    required_skills: [
      { name: 'Network security', importance: 'essential', category: 'technical' },
      { name: 'Ethical hacking', importance: 'important', category: 'technical' },
      { name: 'Analytical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Attention to detail', importance: 'essential', category: 'soft' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Cybersecurity, Computer Science', duration: '4 years' },
      { level: 'certificate', field: 'CISSP, CEH, CompTIA Security+', duration: '6-12 months' }
    ],
    riasec_profile: { realistic: 55, investigative: 90, artistic: 20, social: 25, enterprising: 45, conventional: 65 },
    salary_range: { entry: 65000, median: 105000, experienced: 160000 },
    outlook: { growth: 'rapidly_growing', demand: 'very_high' }
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    category: 'Technology',
    description: 'Defines the vision and roadmap for a product. Works at the intersection of business, technology, and design to build products users love.',
    typical_tasks: [
      'Define product vision and strategy',
      'Gather and prioritise user requirements',
      'Collaborate with engineering, design, and marketing',
      'Analyse user data and market trends',
      'Launch features and measure outcomes'
    ],
    required_skills: [
      { name: 'Strategic thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Communication and storytelling', importance: 'essential', category: 'soft' },
      { name: 'Data analysis', importance: 'important', category: 'technical' },
      { name: 'Leadership without authority', importance: 'essential', category: 'soft' },
      { name: 'User empathy', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Computer Science, Business, Engineering', duration: '4 years' },
      { level: 'master', field: 'MBA, Product Management', duration: '2 years' }
    ],
    riasec_profile: { realistic: 20, investigative: 70, artistic: 55, social: 70, enterprising: 85, conventional: 40 },
    salary_range: { entry: 70000, median: 120000, experienced: 200000 },
    outlook: { growth: 'rapidly_growing', demand: 'very_high' }
  },
  {
    id: 'lawyer',
    name: 'Lawyer / Advocate',
    category: 'Law',
    description: 'Advises clients on legal matters and represents them in court. Specialises in areas like corporate law, criminal law, or civil rights.',
    typical_tasks: [
      'Research and analyse legal issues',
      'Draft legal documents and contracts',
      'Represent clients in court proceedings',
      'Negotiate settlements',
      'Advise on legal rights and obligations'
    ],
    required_skills: [
      { name: 'Legal research and writing', importance: 'essential', category: 'technical' },
      { name: 'Argumentation and persuasion', importance: 'essential', category: 'cognitive' },
      { name: 'Critical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Communication', importance: 'essential', category: 'soft' },
      { name: 'Attention to detail', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'LLB (Law)', duration: '5 years' },
      { level: 'master', field: 'LLM', duration: '1-2 years' }
    ],
    riasec_profile: { realistic: 15, investigative: 75, artistic: 45, social: 65, enterprising: 90, conventional: 60 },
    salary_range: { entry: 50000, median: 100000, experienced: 250000 },
    outlook: { growth: 'stable', demand: 'moderate' }
  },
  {
    id: 'chartered-accountant',
    name: 'Chartered Accountant',
    category: 'Business',
    description: 'Manages financial records, audits accounts, and provides expert financial advice. A highly respected profession with strong career security.',
    typical_tasks: [
      'Prepare and audit financial statements',
      'Manage tax planning and compliance',
      'Advise on financial strategy',
      'Review internal controls and risk',
      'Prepare financial reports for stakeholders'
    ],
    required_skills: [
      { name: 'Accounting and financial reporting', importance: 'essential', category: 'technical' },
      { name: 'Tax law knowledge', importance: 'essential', category: 'technical' },
      { name: 'Analytical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Attention to detail', importance: 'essential', category: 'soft' },
      { name: 'Integrity', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'certificate', field: 'CA / ACCA / ICMA', duration: '3-5 years' },
      { level: 'bachelor', field: 'Accounting, Finance', duration: '4 years' }
    ],
    riasec_profile: { realistic: 20, investigative: 65, artistic: 15, social: 30, enterprising: 55, conventional: 95 },
    salary_range: { entry: 55000, median: 90000, experienced: 180000 },
    outlook: { growth: 'stable', demand: 'high' }
  },
  {
    id: 'journalist',
    name: 'Journalist / Reporter',
    category: 'Media',
    description: 'Investigates, writes, and reports on news and current affairs. Holds power to account and informs the public across print, broadcast, and digital media.',
    typical_tasks: [
      'Research and investigate stories',
      'Conduct interviews with sources',
      'Write articles, scripts, and reports',
      'Verify facts and check sources',
      'Meet tight deadlines'
    ],
    required_skills: [
      { name: 'Writing and storytelling', importance: 'essential', category: 'soft' },
      { name: 'Research and investigation', importance: 'essential', category: 'cognitive' },
      { name: 'Interviewing', importance: 'essential', category: 'soft' },
      { name: 'Critical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Media ethics', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Journalism, Mass Communication', duration: '4 years' }
    ],
    riasec_profile: { realistic: 20, investigative: 65, artistic: 80, social: 70, enterprising: 65, conventional: 30 },
    salary_range: { entry: 35000, median: 60000, experienced: 110000 },
    outlook: { growth: 'stable', demand: 'moderate' }
  },
  {
    id: 'css-officer',
    name: 'Civil Service Officer (CSS)',
    category: 'Government',
    description: 'Serves in Pakistan\'s elite civil service. Manages public administration, policy implementation, and governance across districts and ministries.',
    typical_tasks: [
      'Administer public services and government programmes',
      'Develop and implement policy',
      'Manage teams and government resources',
      'Liaise between government and public',
      'Maintain law and order at district level'
    ],
    required_skills: [
      { name: 'Leadership and administration', importance: 'essential', category: 'soft' },
      { name: 'Policy analysis', importance: 'essential', category: 'cognitive' },
      { name: 'Communication', importance: 'essential', category: 'soft' },
      { name: 'Decision-making', importance: 'essential', category: 'cognitive' },
      { name: 'Integrity and discipline', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Any field (CSS exam qualification)', duration: '4 years' },
      { level: 'master', field: 'Public Administration, Political Science', duration: '2 years' }
    ],
    riasec_profile: { realistic: 30, investigative: 70, artistic: 35, social: 75, enterprising: 80, conventional: 65 },
    salary_range: { entry: 60000, median: 120000, experienced: 250000 },
    outlook: { growth: 'stable', demand: 'high' }
  },
  {
    id: 'military-officer',
    name: 'Military Officer',
    category: 'Government',
    description: 'Leads and manages military personnel and operations. Serves in the Pakistan Army, Navy, or Air Force with responsibility for national defence and leadership.',
    typical_tasks: [
      'Lead and train military units',
      'Plan and execute operations',
      'Manage logistics and resources',
      'Maintain discipline and welfare of troops',
      'Participate in disaster relief and civil support'
    ],
    required_skills: [
      { name: 'Leadership', importance: 'essential', category: 'soft' },
      { name: 'Physical fitness and stamina', importance: 'essential', category: 'soft' },
      { name: 'Decision-making under pressure', importance: 'essential', category: 'cognitive' },
      { name: 'Discipline and integrity', importance: 'essential', category: 'soft' },
      { name: 'Strategic thinking', importance: 'important', category: 'cognitive' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'PMA Long Course / Cadet College / ISSB', duration: '2-4 years' }
    ],
    riasec_profile: { realistic: 75, investigative: 50, artistic: 20, social: 60, enterprising: 85, conventional: 70 },
    salary_range: { entry: 70000, median: 150000, experienced: 300000 },
    outlook: { growth: 'stable', demand: 'high' }
  },
  {
    id: 'hr-manager',
    name: 'HR Manager',
    category: 'Business',
    description: 'Manages an organisation\'s people strategy. Handles recruitment, employee development, culture, and workplace wellbeing.',
    typical_tasks: [
      'Recruit and onboard new employees',
      'Manage employee performance and development',
      'Handle workplace conflict and grievances',
      'Develop HR policies and culture programmes',
      'Ensure legal compliance in employment'
    ],
    required_skills: [
      { name: 'Empathy and people skills', importance: 'essential', category: 'soft' },
      { name: 'Communication', importance: 'essential', category: 'soft' },
      { name: 'Conflict resolution', importance: 'essential', category: 'soft' },
      { name: 'Organisational skills', importance: 'important', category: 'soft' },
      { name: 'Employment law knowledge', importance: 'important', category: 'technical' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Human Resources, Business Administration', duration: '4 years' },
      { level: 'master', field: 'HRM, MBA', duration: '2 years' }
    ],
    riasec_profile: { realistic: 15, investigative: 50, artistic: 40, social: 90, enterprising: 65, conventional: 60 },
    salary_range: { entry: 45000, median: 75000, experienced: 130000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'research-scientist',
    name: 'Research Scientist',
    category: 'Science',
    description: 'Conducts original scientific research to expand knowledge. Works in universities, labs, or research institutes across disciplines like biology, chemistry, or physics.',
    typical_tasks: [
      'Design and conduct experiments',
      'Analyse and interpret data',
      'Write research papers and grant proposals',
      'Present findings at conferences',
      'Collaborate with other researchers'
    ],
    required_skills: [
      { name: 'Scientific methodology', importance: 'essential', category: 'technical' },
      { name: 'Data analysis and statistics', importance: 'essential', category: 'technical' },
      { name: 'Critical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Academic writing', importance: 'essential', category: 'soft' },
      { name: 'Patience and precision', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'doctorate', field: 'Science (Biology, Chemistry, Physics)', duration: '4-5 years' },
      { level: 'master', field: 'Research-focused science', duration: '2 years' }
    ],
    riasec_profile: { realistic: 35, investigative: 95, artistic: 40, social: 35, enterprising: 30, conventional: 60 },
    salary_range: { entry: 55000, median: 85000, experienced: 140000 },
    outlook: { growth: 'growing', demand: 'moderate' }
  },
  {
    id: 'content-creator',
    name: 'Content Creator / YouTuber',
    category: 'Media',
    description: 'Creates engaging content across YouTube, Instagram, TikTok, and podcasts. Builds audiences and monetises through brand partnerships and platforms.',
    typical_tasks: [
      'Plan and script video or written content',
      'Film, edit, and produce media',
      'Grow and engage with audience',
      'Negotiate brand partnerships and sponsorships',
      'Analyse performance metrics'
    ],
    required_skills: [
      { name: 'Creativity and storytelling', importance: 'essential', category: 'cognitive' },
      { name: 'Video production and editing', importance: 'essential', category: 'technical' },
      { name: 'Social media strategy', importance: 'important', category: 'technical' },
      { name: 'Personal branding', importance: 'essential', category: 'soft' },
      { name: 'Consistency and discipline', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Media Studies, Communications, Marketing', duration: '4 years' },
      { level: 'certificate', field: 'Self-taught / online courses', duration: 'varies' }
    ],
    riasec_profile: { realistic: 20, investigative: 35, artistic: 90, social: 75, enterprising: 70, conventional: 25 },
    salary_range: { entry: 20000, median: 80000, experienced: 500000 },
    outlook: { growth: 'rapidly_growing', demand: 'high' }
  },
  {
    id: 'pharmacist',
    name: 'Pharmacist',
    category: 'Healthcare',
    description: 'Dispenses medications, advises patients on drug interactions, and ensures safe use of medicines. Works in hospitals, community pharmacies, or pharmaceutical companies.',
    typical_tasks: [
      'Dispense prescribed medications',
      'Counsel patients on drug use and side effects',
      'Check for drug interactions',
      'Manage pharmacy inventory',
      'Collaborate with doctors and healthcare teams'
    ],
    required_skills: [
      { name: 'Pharmaceutical knowledge', importance: 'essential', category: 'technical' },
      { name: 'Attention to detail', importance: 'essential', category: 'soft' },
      { name: 'Communication', importance: 'essential', category: 'soft' },
      { name: 'Chemistry knowledge', importance: 'essential', category: 'technical' },
      { name: 'Patient care', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Pharmacy (Pharm-D)', duration: '5 years' }
    ],
    riasec_profile: { realistic: 45, investigative: 80, artistic: 20, social: 65, enterprising: 35, conventional: 75 },
    salary_range: { entry: 60000, median: 95000, experienced: 150000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'environmental-scientist',
    name: 'Environmental Scientist',
    category: 'Science',
    description: 'Studies the environment and finds solutions to environmental problems like pollution, climate change, and resource depletion.',
    typical_tasks: [
      'Collect and analyse environmental data',
      'Conduct field research and surveys',
      'Assess environmental impact of projects',
      'Advise on environmental policy',
      'Write environmental reports'
    ],
    required_skills: [
      { name: 'Environmental science knowledge', importance: 'essential', category: 'technical' },
      { name: 'Data analysis', importance: 'essential', category: 'technical' },
      { name: 'Field research skills', importance: 'important', category: 'technical' },
      { name: 'Report writing', importance: 'important', category: 'soft' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Environmental Science, Biology, Chemistry', duration: '4 years' },
      { level: 'master', field: 'Environmental Management', duration: '2 years' }
    ],
    riasec_profile: { realistic: 65, investigative: 85, artistic: 35, social: 45, enterprising: 35, conventional: 55 },
    salary_range: { entry: 50000, median: 75000, experienced: 120000 },
    outlook: { growth: 'growing', demand: 'moderate' }
  },
  {
    id: 'fashion-designer',
    name: 'Fashion / Textile Designer',
    category: 'Creative',
    description: 'Creates clothing, accessories, and textile patterns. Pakistan\'s textile industry is one of the largest in the world — a major career opportunity.',
    typical_tasks: [
      'Design clothing, fabric patterns, and accessories',
      'Research fashion trends',
      'Create sketches and technical drawings',
      'Source fabrics and materials',
      'Collaborate with manufacturers and brands'
    ],
    required_skills: [
      { name: 'Design and creativity', importance: 'essential', category: 'cognitive' },
      { name: 'Sewing and garment construction', importance: 'important', category: 'technical' },
      { name: 'Trend awareness', importance: 'essential', category: 'soft' },
      { name: 'CAD / design software', importance: 'important', category: 'technical' },
      { name: 'Business sense', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Fashion Design, Textile Design', duration: '4 years' },
      { level: 'associate', field: 'Fashion Design Diploma', duration: '2 years' }
    ],
    riasec_profile: { realistic: 45, investigative: 30, artistic: 95, social: 50, enterprising: 55, conventional: 35 },
    salary_range: { entry: 35000, median: 70000, experienced: 200000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'operations-manager',
    name: 'Operations Manager',
    category: 'Business',
    description: 'Oversees the day-to-day running of a business or department. Ensures systems, people, and processes work efficiently to deliver results.',
    typical_tasks: [
      'Manage daily operations and workflows',
      'Optimise processes and reduce inefficiencies',
      'Lead and develop teams',
      'Monitor KPIs and performance metrics',
      'Liaise between departments and senior management'
    ],
    required_skills: [
      { name: 'Leadership', importance: 'essential', category: 'soft' },
      { name: 'Process improvement', importance: 'essential', category: 'technical' },
      { name: 'Analytical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Communication', importance: 'essential', category: 'soft' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Business Administration, Industrial Engineering', duration: '4 years' },
      { level: 'master', field: 'MBA, Operations Management', duration: '2 years' }
    ],
    riasec_profile: { realistic: 40, investigative: 60, artistic: 25, social: 65, enterprising: 85, conventional: 70 },
    salary_range: { entry: 55000, median: 95000, experienced: 160000 },
    outlook: { growth: 'growing', demand: 'high' }
  },

  // ── MEDICINE ──────────────────────────────────────────────────────────────

  {
    id: 'medicine-clinical',
    name: 'Doctor (MBBS) — Clinical Medicine',
    category: 'Medicine',
    description: 'Diagnoses and treats patients across all areas of medicine. After MBBS, doctors specialise through FCPS or MRCP in fields such as Cardiology, Surgery, Orthopaedics, ENT, Neurology, Gynaecology, Paediatrics, Dermatology, Ophthalmology, Urology, and more. The specialisation you choose happens after clinical rotations in medical school — not before. Entry via MDCAT.',
    typical_tasks: [
      'Examine patients and diagnose illnesses',
      'Prescribe treatments and medications',
      'Perform or assist in medical procedures',
      'Collaborate with specialists and nursing staff',
      'Manage patient care from admission to discharge'
    ],
    required_skills: [
      { name: 'Medical knowledge and clinical reasoning', importance: 'essential', category: 'technical' },
      { name: 'Empathy and patient communication', importance: 'essential', category: 'soft' },
      { name: 'Decision-making under pressure', importance: 'essential', category: 'cognitive' },
      { name: 'Stamina and emotional resilience', importance: 'essential', category: 'soft' },
      { name: 'Attention to detail', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'doctorate', field: 'MBBS (5 years) + House Job (1 year) + FCPS Specialisation (4-6 years)', duration: '10-12 years total' }
    ],
    riasec_profile: { realistic: 55, investigative: 88, artistic: 25, social: 85, enterprising: 40, conventional: 60 },
    salary_range: { entry: 80000, median: 350000, experienced: 1200000 },
    outlook: { growth: 'rapidly_growing', demand: 'very_high' }
  },
  {
    id: 'medicine-surgical',
    name: 'Surgeon (MBBS + Surgical Specialisation)',
    category: 'Medicine',
    description: 'Performs operations to treat diseases, injuries, and deformities. Surgical specialisations include General Surgery, Orthopaedics (bones & joints), Neurosurgery (brain & spine), Cardiac Surgery, ENT (ear/nose/throat), Ophthalmology (eyes), Urology, Plastic Surgery, and Gynaecological Surgery. Entry via MDCAT then FCPS.',
    typical_tasks: [
      'Perform surgical procedures across a specialisation',
      'Diagnose conditions requiring surgical intervention',
      'Manage pre- and post-operative patient care',
      'Handle emergency surgical cases',
      'Train junior doctors and residents'
    ],
    required_skills: [
      { name: 'Surgical precision and manual dexterity', importance: 'essential', category: 'technical' },
      { name: 'Anatomy knowledge', importance: 'essential', category: 'technical' },
      { name: 'Calm under extreme pressure', importance: 'essential', category: 'soft' },
      { name: 'Stamina (long operating hours)', importance: 'essential', category: 'soft' },
      { name: 'Spatial and 3D thinking', importance: 'essential', category: 'cognitive' }
    ],
    education_pathways: [
      { level: 'doctorate', field: 'MBBS + FCPS Surgery / Orthopaedics / Neurosurgery / ENT / Ophthalmology', duration: '11-13 years' }
    ],
    riasec_profile: { realistic: 88, investigative: 85, artistic: 30, social: 60, enterprising: 45, conventional: 58 },
    salary_range: { entry: 150000, median: 500000, experienced: 1500000 },
    outlook: { growth: 'growing', demand: 'very_high' }
  },
  {
    id: 'medicine-diagnostics',
    name: 'Diagnostic Medicine (Radiology / Pathology / Lab)',
    category: 'Medicine',
    description: 'The science of finding what is wrong — without being at the bedside. Includes Radiology (X-ray, MRI, CT, Ultrasound), Pathology (disease analysis from tissue and blood), Haematology, and Microbiology. These doctors are the detectives of medicine — analytical, precise, and detail-oriented. Entry via MBBS then FCPS.',
    typical_tasks: [
      'Interpret medical images (MRI, CT, X-ray, Ultrasound)',
      'Analyse blood, tissue, and biopsy samples',
      'Write diagnostic reports for clinical teams',
      'Identify disease patterns and abnormalities',
      'Ensure quality and accuracy of lab results'
    ],
    required_skills: [
      { name: 'Medical imaging or laboratory analysis', importance: 'essential', category: 'technical' },
      { name: 'Extreme attention to detail', importance: 'essential', category: 'soft' },
      { name: 'Analytical and pattern-recognition thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Anatomy and pathophysiology knowledge', importance: 'essential', category: 'technical' },
      { name: 'Report writing', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'doctorate', field: 'MBBS + FCPS Radiology / Pathology / Haematology', duration: '10-12 years' }
    ],
    riasec_profile: { realistic: 60, investigative: 95, artistic: 30, social: 35, enterprising: 25, conventional: 80 },
    salary_range: { entry: 120000, median: 450000, experienced: 1200000 },
    outlook: { growth: 'rapidly_growing', demand: 'very_high' }
  },
  {
    id: 'medicine-mental-health',
    name: 'Psychiatrist / Mental Health Doctor',
    category: 'Medicine',
    description: 'A medical doctor who specialises in diagnosing and treating mental health conditions — depression, anxiety, schizophrenia, bipolar disorder, addiction, and more. Uses both medication and therapy. One of the most underserved and critically needed specialisations in Pakistan. Entry via MBBS then FCPS Psychiatry.',
    typical_tasks: [
      'Diagnose and treat psychiatric conditions',
      'Prescribe and manage psychiatric medications',
      'Provide psychotherapy and counselling',
      'Work with families and support networks',
      'Manage inpatient and outpatient mental health care'
    ],
    required_skills: [
      { name: 'Deep empathy and emotional intelligence', importance: 'essential', category: 'soft' },
      { name: 'Psychiatric and medical knowledge', importance: 'essential', category: 'technical' },
      { name: 'Active listening', importance: 'essential', category: 'soft' },
      { name: 'Analytical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Emotional resilience', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'doctorate', field: 'MBBS + FCPS Psychiatry', duration: '10-11 years' }
    ],
    riasec_profile: { realistic: 25, investigative: 88, artistic: 50, social: 92, enterprising: 35, conventional: 55 },
    salary_range: { entry: 120000, median: 350000, experienced: 900000 },
    outlook: { growth: 'rapidly_growing', demand: 'very_high' }
  },
  {
    id: 'dentist',
    name: 'Dentist (BDS)',
    category: 'Medicine',
    description: 'Diagnoses and treats problems with teeth, gums, and the mouth. Dental specialisations include Orthodontics (braces/alignment), Oral Surgery, Endodontics (root canals), Prosthodontics (crowns/implants), and Periodontics (gum disease). Strong private practice income potential in Pakistan. Entry via MCAT (Dental).',
    typical_tasks: [
      'Examine and diagnose dental and oral conditions',
      'Perform fillings, extractions, root canals, and implants',
      'Design orthodontic treatment plans',
      'Provide oral hygiene education',
      'Run or manage a dental practice'
    ],
    required_skills: [
      { name: 'Manual dexterity and precision', importance: 'essential', category: 'technical' },
      { name: 'Dental science knowledge', importance: 'essential', category: 'technical' },
      { name: 'Attention to detail', importance: 'essential', category: 'soft' },
      { name: 'Patient communication and empathy', importance: 'essential', category: 'soft' },
      { name: 'Spatial and visual thinking', importance: 'essential', category: 'cognitive' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'BDS — Bachelor of Dental Surgery (5 years)', duration: '5 years' },
      { level: 'master', field: 'FCPS Orthodontics / Oral Surgery / Prosthodontics', duration: '4-5 years' }
    ],
    riasec_profile: { realistic: 78, investigative: 75, artistic: 45, social: 70, enterprising: 52, conventional: 65 },
    salary_range: { entry: 80000, median: 250000, experienced: 800000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'allied-health',
    name: 'Allied Health Professional',
    category: 'Medicine',
    description: 'A broad group of health careers that work alongside doctors and nurses. Includes Physiotherapy (rehabilitation), Pharmacy (medicines), Medical Lab Technology, Nutrition & Dietetics, Occupational Therapy, Speech Therapy, and Radiography. Shorter training than MBBS, strong demand, and direct patient impact.',
    typical_tasks: [
      'Assess and treat patients in your specialisation',
      'Work in hospitals, clinics, or community settings',
      'Collaborate with doctors and nursing teams',
      'Maintain patient records and progress reports',
      'Educate patients and families'
    ],
    required_skills: [
      { name: 'Clinical knowledge in your field', importance: 'essential', category: 'technical' },
      { name: 'Empathy and patient care', importance: 'essential', category: 'soft' },
      { name: 'Attention to detail', importance: 'essential', category: 'soft' },
      { name: 'Communication', importance: 'essential', category: 'soft' },
      { name: 'Problem-solving', importance: 'important', category: 'cognitive' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'BS Physiotherapy / Pharmacy (Pharm-D) / MLT / Nutrition / Occupational Therapy', duration: '4-5 years' }
    ],
    riasec_profile: { realistic: 55, investigative: 72, artistic: 28, social: 82, enterprising: 35, conventional: 68 },
    salary_range: { entry: 45000, median: 100000, experienced: 220000 },
    outlook: { growth: 'growing', demand: 'very_high' }
  },
  {
    id: 'veterinarian',
    name: 'Veterinarian (DVM)',
    category: 'Medicine',
    description: 'Diagnoses and treats diseases in animals. Critical in Pakistan for livestock and poultry health — key to the agricultural economy. Also growing in pet care as urban Pakistan\'s middle class expands. Entry via DVM at UAF, UVAS, SBBUVAS.',
    typical_tasks: [
      'Examine and diagnose sick or injured animals',
      'Perform surgical and medical procedures on animals',
      'Advise farmers on herd and flock health',
      'Administer vaccines and disease prevention programmes',
      'Work with government on livestock disease control'
    ],
    required_skills: [
      { name: 'Veterinary medical knowledge', importance: 'essential', category: 'technical' },
      { name: 'Manual dexterity for procedures', importance: 'essential', category: 'technical' },
      { name: 'Empathy for animals', importance: 'essential', category: 'soft' },
      { name: 'Communication with farmers and owners', importance: 'important', category: 'soft' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'DVM — Doctor of Veterinary Medicine (5 years)', duration: '5 years' }
    ],
    riasec_profile: { realistic: 72, investigative: 80, artistic: 30, social: 65, enterprising: 35, conventional: 55 },
    salary_range: { entry: 50000, median: 100000, experienced: 220000 },
    outlook: { growth: 'growing', demand: 'high' }
  },

  // ── ENGINEERING ───────────────────────────────────────────────────────────

  {
    id: 'electrical-engineer',
    name: 'Electrical Engineer',
    category: 'Engineering',
    description: 'Designs and develops electrical systems, power grids, and electronic equipment. Critical for Pakistan\'s energy sector and manufacturing industry.',
    typical_tasks: [
      'Design electrical systems and circuits',
      'Oversee installation of power systems',
      'Test and troubleshoot electrical equipment',
      'Ensure safety and compliance',
      'Work on power generation and distribution'
    ],
    required_skills: [
      { name: 'Electrical engineering principles', importance: 'essential', category: 'technical' },
      { name: 'Circuit design and CAD', importance: 'essential', category: 'technical' },
      { name: 'Mathematics and physics', importance: 'essential', category: 'technical' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' },
      { name: 'Project management', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'BE/BSc Electrical Engineering', duration: '4 years' }
    ],
    riasec_profile: { realistic: 80, investigative: 85, artistic: 20, social: 30, enterprising: 40, conventional: 65 },
    salary_range: { entry: 60000, median: 110000, experienced: 200000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'chemical-engineer',
    name: 'Chemical Engineer',
    category: 'Engineering',
    description: 'Applies chemistry, physics, and maths to design processes for producing chemicals, fuels, medicines, and food. Strong demand in Pakistan\'s textile and pharma sectors.',
    typical_tasks: [
      'Design and optimise chemical processes',
      'Oversee production in plants and factories',
      'Ensure safety and environmental compliance',
      'Analyse product quality and troubleshoot issues',
      'Develop new materials and processes'
    ],
    required_skills: [
      { name: 'Chemistry and process engineering', importance: 'essential', category: 'technical' },
      { name: 'Mathematics', importance: 'essential', category: 'technical' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' },
      { name: 'Safety awareness', importance: 'essential', category: 'soft' },
      { name: 'Analytical thinking', importance: 'essential', category: 'cognitive' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'BE/BSc Chemical Engineering', duration: '4 years' }
    ],
    riasec_profile: { realistic: 65, investigative: 90, artistic: 20, social: 30, enterprising: 40, conventional: 65 },
    salary_range: { entry: 65000, median: 115000, experienced: 210000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'petroleum-engineer',
    name: 'Petroleum Engineer',
    category: 'Engineering',
    description: 'Designs and develops methods for extracting oil and gas. High salaries and strong demand in Pakistan\'s energy sector (OGDCL, PPL, ENI).',
    typical_tasks: [
      'Design oil and gas extraction methods',
      'Analyse geological data to locate reserves',
      'Oversee drilling operations',
      'Optimise production from existing wells',
      'Ensure environmental and safety compliance'
    ],
    required_skills: [
      { name: 'Petroleum engineering principles', importance: 'essential', category: 'technical' },
      { name: 'Geology and geophysics knowledge', importance: 'essential', category: 'technical' },
      { name: 'Data analysis', importance: 'essential', category: 'cognitive' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' },
      { name: 'Project management', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'BE Petroleum Engineering (NED, UET)', duration: '4 years' }
    ],
    riasec_profile: { realistic: 80, investigative: 85, artistic: 15, social: 25, enterprising: 55, conventional: 60 },
    salary_range: { entry: 100000, median: 250000, experienced: 600000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'biomedical-engineer',
    name: 'Biomedical Engineer',
    category: 'Engineering',
    description: 'Combines engineering with biology and medicine to develop medical devices, equipment, and technologies. A fast-growing bridge between medicine and tech.',
    typical_tasks: [
      'Design medical devices and equipment',
      'Maintain hospital equipment',
      'Research new medical technologies',
      'Test and validate medical devices',
      'Work with doctors to solve clinical problems'
    ],
    required_skills: [
      { name: 'Biomedical engineering knowledge', importance: 'essential', category: 'technical' },
      { name: 'Biology and physiology', importance: 'essential', category: 'technical' },
      { name: 'Electronics and mechanics', importance: 'essential', category: 'technical' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' },
      { name: 'Communication with medical staff', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'BE Biomedical Engineering', duration: '4 years' },
      { level: 'master', field: 'MS Biomedical Engineering', duration: '2 years' }
    ],
    riasec_profile: { realistic: 65, investigative: 90, artistic: 30, social: 55, enterprising: 35, conventional: 60 },
    salary_range: { entry: 65000, median: 120000, experienced: 220000 },
    outlook: { growth: 'rapidly_growing', demand: 'very_high' }
  },
  {
    id: 'aerospace-engineer',
    name: 'Aerospace Engineer',
    category: 'Engineering',
    description: 'Designs aircraft, spacecraft, and defence systems. Works with Pakistan Air Force, PAC (Pakistan Aeronautical Complex), and aviation companies.',
    typical_tasks: [
      'Design and test aircraft and aerospace systems',
      'Analyse aerodynamic performance',
      'Develop defence and aviation technologies',
      'Ensure airworthiness and safety',
      'Collaborate with military and civil aviation bodies'
    ],
    required_skills: [
      { name: 'Aeronautical engineering principles', importance: 'essential', category: 'technical' },
      { name: 'Physics and mathematics', importance: 'essential', category: 'technical' },
      { name: 'CAD and simulation tools', importance: 'essential', category: 'technical' },
      { name: 'Analytical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Precision and attention to detail', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'BE Aerospace Engineering (CAE, NUST)', duration: '4 years' }
    ],
    riasec_profile: { realistic: 75, investigative: 95, artistic: 30, social: 25, enterprising: 40, conventional: 60 },
    salary_range: { entry: 80000, median: 180000, experienced: 400000 },
    outlook: { growth: 'growing', demand: 'moderate' }
  },
  {
    id: 'telecom-engineer',
    name: 'Telecommunications Engineer',
    category: 'Engineering',
    description: 'Designs and manages communication networks including mobile, internet, and satellite systems. Strong demand with 5G rollout and telecom expansion in Pakistan.',
    typical_tasks: [
      'Design and maintain telecom networks',
      'Install and configure communication systems',
      'Troubleshoot network issues',
      'Optimise network performance',
      'Plan infrastructure for new technologies (5G)'
    ],
    required_skills: [
      { name: 'Networking and telecommunications', importance: 'essential', category: 'technical' },
      { name: 'Signal processing', importance: 'essential', category: 'technical' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' },
      { name: 'Electronics knowledge', importance: 'important', category: 'technical' },
      { name: 'Project management', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'BE Telecommunications Engineering', duration: '4 years' }
    ],
    riasec_profile: { realistic: 70, investigative: 85, artistic: 20, social: 30, enterprising: 40, conventional: 65 },
    salary_range: { entry: 65000, median: 120000, experienced: 220000 },
    outlook: { growth: 'rapidly_growing', demand: 'very_high' }
  },

  // ── FINANCE / BUSINESS ────────────────────────────────────────────────────

  {
    id: 'actuary',
    name: 'Actuary',
    category: 'Business',
    description: 'Uses mathematics and statistics to assess financial risk for insurance companies, banks, and pension funds. One of the highest-paid professions globally.',
    typical_tasks: [
      'Analyse statistical data to assess risk',
      'Design insurance and pension products',
      'Build financial models and projections',
      'Advise companies on risk management',
      'Prepare regulatory reports'
    ],
    required_skills: [
      { name: 'Advanced mathematics and statistics', importance: 'essential', category: 'technical' },
      { name: 'Financial modelling', importance: 'essential', category: 'technical' },
      { name: 'Analytical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Attention to detail', importance: 'essential', category: 'soft' },
      { name: 'Communication', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Mathematics, Statistics, Actuarial Science', duration: '4 years' },
      { level: 'certificate', field: 'Actuarial exams (SOA/CAS/IFoA)', duration: '3-7 years' }
    ],
    riasec_profile: { realistic: 20, investigative: 90, artistic: 20, social: 30, enterprising: 55, conventional: 95 },
    salary_range: { entry: 100000, median: 200000, experienced: 500000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'supply-chain-manager',
    name: 'Supply Chain Manager',
    category: 'Business',
    description: 'Oversees the flow of goods from suppliers to customers. Critical in Pakistan\'s manufacturing and retail sectors.',
    typical_tasks: [
      'Manage procurement and supplier relationships',
      'Optimise logistics and inventory',
      'Reduce costs across the supply chain',
      'Coordinate with production and sales teams',
      'Handle import/export operations'
    ],
    required_skills: [
      { name: 'Logistics and operations knowledge', importance: 'essential', category: 'technical' },
      { name: 'Analytical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Negotiation', importance: 'essential', category: 'soft' },
      { name: 'Organisation', importance: 'essential', category: 'soft' },
      { name: 'Communication', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Supply Chain Management, Business Administration', duration: '4 years' },
      { level: 'master', field: 'MBA, MS Supply Chain', duration: '2 years' }
    ],
    riasec_profile: { realistic: 50, investigative: 65, artistic: 20, social: 55, enterprising: 80, conventional: 75 },
    salary_range: { entry: 60000, median: 110000, experienced: 220000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'real-estate-developer',
    name: 'Real Estate Developer',
    category: 'Business',
    description: 'Buys, develops, and sells property. One of the most lucrative sectors in Pakistan\'s economy (DHA, Bahria Town, etc.).',
    typical_tasks: [
      'Identify and acquire land and properties',
      'Develop and manage construction projects',
      'Market and sell properties',
      'Manage client relationships',
      'Analyse market trends and investment opportunities'
    ],
    required_skills: [
      { name: 'Sales and negotiation', importance: 'essential', category: 'soft' },
      { name: 'Market analysis', importance: 'essential', category: 'cognitive' },
      { name: 'Financial acumen', importance: 'essential', category: 'technical' },
      { name: 'Networking', importance: 'essential', category: 'soft' },
      { name: 'Project management', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Business, Finance, Civil Engineering', duration: '4 years' },
      { level: 'certificate', field: 'Real Estate Certifications', duration: 'varies' }
    ],
    riasec_profile: { realistic: 60, investigative: 55, artistic: 40, social: 60, enterprising: 90, conventional: 60 },
    salary_range: { entry: 50000, median: 200000, experienced: 1000000 },
    outlook: { growth: 'growing', demand: 'high' }
  },

  // ── TECHNOLOGY (EXTENDED) ─────────────────────────────────────────────────

  {
    id: 'devops-engineer',
    name: 'DevOps / Cloud Engineer',
    category: 'Technology',
    description: 'Manages the infrastructure, automation, and deployment pipelines that keep software running. High demand globally and in Pakistan\'s tech scene.',
    typical_tasks: [
      'Build and maintain CI/CD pipelines',
      'Manage cloud infrastructure (AWS, Azure, GCP)',
      'Automate deployment and testing processes',
      'Monitor system performance and uptime',
      'Ensure security and scalability'
    ],
    required_skills: [
      { name: 'Linux and scripting (Bash, Python)', importance: 'essential', category: 'technical' },
      { name: 'Cloud platforms (AWS/Azure/GCP)', importance: 'essential', category: 'technical' },
      { name: 'Docker and Kubernetes', importance: 'essential', category: 'technical' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' },
      { name: 'Attention to detail', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Computer Science, Software Engineering', duration: '4 years' },
      { level: 'certificate', field: 'AWS/Azure/GCP Certifications', duration: '6-12 months' }
    ],
    riasec_profile: { realistic: 65, investigative: 85, artistic: 20, social: 25, enterprising: 40, conventional: 70 },
    salary_range: { entry: 70000, median: 130000, experienced: 250000 },
    outlook: { growth: 'rapidly_growing', demand: 'very_high' }
  },
  {
    id: 'network-engineer',
    name: 'Network Engineer',
    category: 'Technology',
    description: 'Designs, builds, and maintains computer networks. Critical for banks, telecom companies, and large organisations across Pakistan.',
    typical_tasks: [
      'Design and implement network infrastructure',
      'Configure routers, switches, and firewalls',
      'Troubleshoot network connectivity issues',
      'Monitor network performance and security',
      'Plan network upgrades and expansion'
    ],
    required_skills: [
      { name: 'Networking protocols (TCP/IP, BGP, OSPF)', importance: 'essential', category: 'technical' },
      { name: 'Network hardware configuration', importance: 'essential', category: 'technical' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' },
      { name: 'Security knowledge', importance: 'important', category: 'technical' },
      { name: 'Attention to detail', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Computer Science, Networking', duration: '4 years' },
      { level: 'certificate', field: 'CCNA, CCNP', duration: '6-18 months' }
    ],
    riasec_profile: { realistic: 70, investigative: 80, artistic: 15, social: 25, enterprising: 35, conventional: 70 },
    salary_range: { entry: 55000, median: 100000, experienced: 180000 },
    outlook: { growth: 'growing', demand: 'high' }
  },

  // ── EDUCATION / ACADEMIA ──────────────────────────────────────────────────

  {
    id: 'university-professor',
    name: 'University Professor',
    category: 'Education',
    description: 'Teaches and conducts research at university level. Shapes the next generation of professionals and contributes to knowledge in their field.',
    typical_tasks: [
      'Deliver lectures and seminars',
      'Conduct and publish research',
      'Supervise student projects and theses',
      'Develop course curriculum',
      'Participate in academic conferences'
    ],
    required_skills: [
      { name: 'Subject matter expertise', importance: 'essential', category: 'technical' },
      { name: 'Research and academic writing', importance: 'essential', category: 'technical' },
      { name: 'Communication and teaching', importance: 'essential', category: 'soft' },
      { name: 'Critical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Mentoring', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'doctorate', field: 'PhD in relevant field', duration: '4-6 years' }
    ],
    riasec_profile: { realistic: 25, investigative: 90, artistic: 55, social: 70, enterprising: 45, conventional: 55 },
    salary_range: { entry: 80000, median: 150000, experienced: 300000 },
    outlook: { growth: 'growing', demand: 'moderate' }
  },
  {
    id: 'corporate-trainer',
    name: 'Corporate Trainer / L&D Specialist',
    category: 'Education',
    description: 'Designs and delivers training programmes for employees in organisations. Bridges the gap between knowledge and workplace performance.',
    typical_tasks: [
      'Design training programmes and workshops',
      'Deliver classroom and online training',
      'Assess training needs in the organisation',
      'Measure training effectiveness',
      'Develop e-learning content'
    ],
    required_skills: [
      { name: 'Facilitation and presentation', importance: 'essential', category: 'soft' },
      { name: 'Instructional design', importance: 'essential', category: 'technical' },
      { name: 'Communication', importance: 'essential', category: 'soft' },
      { name: 'Empathy', importance: 'important', category: 'soft' },
      { name: 'Subject matter knowledge', importance: 'essential', category: 'technical' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Education, HR, Psychology, Business', duration: '4 years' },
      { level: 'certificate', field: 'L&D Certifications (CIPD, ATD)', duration: '6-12 months' }
    ],
    riasec_profile: { realistic: 20, investigative: 55, artistic: 60, social: 90, enterprising: 65, conventional: 50 },
    salary_range: { entry: 50000, median: 90000, experienced: 170000 },
    outlook: { growth: 'growing', demand: 'high' }
  },

  // ── SOCIAL SCIENCES / PUBLIC SECTOR ──────────────────────────────────────

  {
    id: 'economist',
    name: 'Economist',
    category: 'Social Science',
    description: 'Studies how societies produce, distribute, and consume goods and services. Works in government, banks, think tanks, and international organisations.',
    typical_tasks: [
      'Analyse economic data and trends',
      'Build economic models and forecasts',
      'Advise on economic policy',
      'Write research papers and reports',
      'Present findings to policymakers'
    ],
    required_skills: [
      { name: 'Econometrics and statistics', importance: 'essential', category: 'technical' },
      { name: 'Economic theory', importance: 'essential', category: 'technical' },
      { name: 'Analytical thinking', importance: 'essential', category: 'cognitive' },
      { name: 'Research and writing', importance: 'essential', category: 'soft' },
      { name: 'Data analysis tools', importance: 'important', category: 'technical' }
    ],
    education_pathways: [
      { level: 'master', field: 'Economics, Econometrics', duration: '2 years' },
      { level: 'bachelor', field: 'Economics (LUMS, IBA, QAU)', duration: '4 years' }
    ],
    riasec_profile: { realistic: 20, investigative: 90, artistic: 40, social: 50, enterprising: 60, conventional: 70 },
    salary_range: { entry: 70000, median: 140000, experienced: 300000 },
    outlook: { growth: 'growing', demand: 'moderate' }
  },
  {
    id: 'diplomat',
    name: 'Diplomat / Foreign Service Officer',
    category: 'Government',
    description: 'Represents Pakistan\'s interests abroad. Works in embassies, high commissions, and international organisations like the UN.',
    typical_tasks: [
      'Represent Pakistan in foreign countries',
      'Negotiate treaties and agreements',
      'Report on political and economic developments',
      'Support Pakistani citizens abroad',
      'Build relationships with foreign governments'
    ],
    required_skills: [
      { name: 'Communication and negotiation', importance: 'essential', category: 'soft' },
      { name: 'Political and cultural awareness', importance: 'essential', category: 'cognitive' },
      { name: 'Foreign languages', importance: 'important', category: 'technical' },
      { name: 'Research and analysis', importance: 'essential', category: 'cognitive' },
      { name: 'Interpersonal skills', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'International Relations, Political Science, Law', duration: '4 years' },
      { level: 'master', field: 'International Relations, Diplomacy', duration: '2 years' }
    ],
    riasec_profile: { realistic: 20, investigative: 75, artistic: 50, social: 80, enterprising: 85, conventional: 55 },
    salary_range: { entry: 100000, median: 200000, experienced: 400000 },
    outlook: { growth: 'stable', demand: 'moderate' }
  },
  {
    id: 'social-worker',
    name: 'Social Worker / NGO Professional',
    category: 'Social Science',
    description: 'Works to improve the lives of vulnerable individuals and communities. Pakistan\'s development sector includes hundreds of NGOs and international organisations (UN, UNICEF, Aga Khan).',
    typical_tasks: [
      'Assess needs of individuals and communities',
      'Connect people with support services',
      'Develop and manage community programmes',
      'Advocate for vulnerable groups',
      'Write reports and funding proposals'
    ],
    required_skills: [
      { name: 'Empathy and compassion', importance: 'essential', category: 'soft' },
      { name: 'Communication and advocacy', importance: 'essential', category: 'soft' },
      { name: 'Community development knowledge', importance: 'essential', category: 'technical' },
      { name: 'Problem-solving', importance: 'important', category: 'cognitive' },
      { name: 'Report writing', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Social Work, Sociology, Development Studies', duration: '4 years' },
      { level: 'master', field: 'MSW, Development Studies', duration: '2 years' }
    ],
    riasec_profile: { realistic: 25, investigative: 55, artistic: 45, social: 95, enterprising: 60, conventional: 45 },
    salary_range: { entry: 50000, median: 90000, experienced: 180000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'pilot',
    name: 'Commercial Airline Pilot',
    category: 'Government',
    description: 'Flies commercial aircraft carrying passengers and cargo. A prestigious, well-paid career requiring rigorous training and discipline.',
    typical_tasks: [
      'Fly aircraft on domestic and international routes',
      'Conduct pre-flight checks and briefings',
      'Navigate and communicate with air traffic control',
      'Manage in-flight emergencies',
      'Maintain flight logs and records'
    ],
    required_skills: [
      { name: 'Aviation and flight skills', importance: 'essential', category: 'technical' },
      { name: 'Spatial awareness', importance: 'essential', category: 'cognitive' },
      { name: 'Decision-making under pressure', importance: 'essential', category: 'cognitive' },
      { name: 'Communication', importance: 'essential', category: 'soft' },
      { name: 'Discipline and precision', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'certificate', field: 'CPL / ATPL (CAA Pakistan)', duration: '2-4 years' },
      { level: 'bachelor', field: 'Avionics, Aerospace Engineering', duration: '4 years' }
    ],
    riasec_profile: { realistic: 80, investigative: 75, artistic: 25, social: 45, enterprising: 60, conventional: 75 },
    salary_range: { entry: 200000, median: 500000, experienced: 1200000 },
    outlook: { growth: 'growing', demand: 'high' }
  },

  // ── CREATIVE (EXTENDED) ───────────────────────────────────────────────────

  {
    id: 'filmmaker',
    name: 'Filmmaker / Director',
    category: 'Creative',
    description: 'Creates films, documentaries, and video content. Pakistan\'s media and entertainment industry (Hum TV, ARY, Lollywood) is growing rapidly.',
    typical_tasks: [
      'Develop scripts and story concepts',
      'Direct actors and crew on set',
      'Oversee editing and post-production',
      'Manage production budgets',
      'Collaborate with producers and studios'
    ],
    required_skills: [
      { name: 'Storytelling and direction', importance: 'essential', category: 'cognitive' },
      { name: 'Visual composition', importance: 'essential', category: 'technical' },
      { name: 'Leadership on set', importance: 'essential', category: 'soft' },
      { name: 'Editing and post-production', importance: 'important', category: 'technical' },
      { name: 'Communication', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Film Studies, Media Production, Mass Communication', duration: '4 years' }
    ],
    riasec_profile: { realistic: 40, investigative: 50, artistic: 95, social: 60, enterprising: 75, conventional: 25 },
    salary_range: { entry: 40000, median: 120000, experienced: 500000 },
    outlook: { growth: 'growing', demand: 'moderate' }
  },
  {
    id: 'animator',
    name: 'Animator / Motion Graphics Designer',
    category: 'Creative',
    description: 'Creates animated visuals for film, TV, games, and digital media. Growing demand from Pakistan\'s gaming and media industries.',
    typical_tasks: [
      'Create 2D and 3D animations',
      'Design motion graphics for video and presentations',
      'Use animation software (Maya, Blender, After Effects)',
      'Collaborate with directors and game designers',
      'Iterate based on feedback'
    ],
    required_skills: [
      { name: 'Animation software (Maya, Blender, After Effects)', importance: 'essential', category: 'technical' },
      { name: 'Creativity and artistic ability', importance: 'essential', category: 'cognitive' },
      { name: 'Attention to detail', importance: 'essential', category: 'soft' },
      { name: 'Storytelling through visuals', importance: 'important', category: 'cognitive' },
      { name: 'Time management', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Animation, Fine Arts, Design', duration: '4 years' },
      { level: 'certificate', field: 'Animation Bootcamp / Online courses', duration: '6-12 months' }
    ],
    riasec_profile: { realistic: 50, investigative: 55, artistic: 95, social: 35, enterprising: 40, conventional: 45 },
    salary_range: { entry: 40000, median: 90000, experienced: 200000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'interior-designer',
    name: 'Interior Designer',
    category: 'Creative',
    description: 'Plans and designs interior spaces for homes, offices, and commercial buildings. Strong demand from Pakistan\'s booming construction and real estate sector.',
    typical_tasks: [
      'Plan and design interior spaces',
      'Select furniture, colours, and materials',
      'Create 2D/3D layouts and visualisations',
      'Manage client expectations and budgets',
      'Collaborate with architects and contractors'
    ],
    required_skills: [
      { name: 'Spatial design and creativity', importance: 'essential', category: 'cognitive' },
      { name: 'CAD and 3D design software', importance: 'essential', category: 'technical' },
      { name: 'Colour theory and aesthetics', importance: 'essential', category: 'technical' },
      { name: 'Client communication', importance: 'essential', category: 'soft' },
      { name: 'Project management', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Interior Design, Architecture', duration: '4 years' },
      { level: 'associate', field: 'Interior Design Diploma', duration: '2 years' }
    ],
    riasec_profile: { realistic: 50, investigative: 40, artistic: 90, social: 55, enterprising: 60, conventional: 45 },
    salary_range: { entry: 40000, median: 90000, experienced: 250000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'writer-author',
    name: 'Writer / Author',
    category: 'Creative',
    description: 'Creates written content — novels, non-fiction books, screenplays, poetry, or digital content. Can be combined with journalism, teaching, or content marketing.',
    typical_tasks: [
      'Research and write books or articles',
      'Develop compelling narratives and characters',
      'Edit and revise drafts',
      'Work with publishers or self-publish',
      'Build an audience and personal brand'
    ],
    required_skills: [
      { name: 'Writing and storytelling', importance: 'essential', category: 'soft' },
      { name: 'Research ability', importance: 'essential', category: 'cognitive' },
      { name: 'Creativity', importance: 'essential', category: 'cognitive' },
      { name: 'Discipline and consistency', importance: 'essential', category: 'soft' },
      { name: 'Self-editing and critique', importance: 'important', category: 'cognitive' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'English Literature, Creative Writing, Mass Comm', duration: '4 years' }
    ],
    riasec_profile: { realistic: 15, investigative: 70, artistic: 95, social: 50, enterprising: 45, conventional: 40 },
    salary_range: { entry: 25000, median: 70000, experienced: 300000 },
    outlook: { growth: 'stable', demand: 'moderate' }
  },
  {
    id: 'advertising-creative',
    name: 'Advertising Creative Director',
    category: 'Creative',
    description: 'Leads the creative vision for advertising campaigns across TV, digital, and print. Shapes how brands communicate with audiences.',
    typical_tasks: [
      'Develop creative concepts for campaigns',
      'Lead a team of designers, writers, and art directors',
      'Present ideas to clients',
      'Ensure creative quality across all outputs',
      'Stay ahead of marketing and cultural trends'
    ],
    required_skills: [
      { name: 'Creative thinking and ideation', importance: 'essential', category: 'cognitive' },
      { name: 'Leadership', importance: 'essential', category: 'soft' },
      { name: 'Visual and verbal communication', importance: 'essential', category: 'soft' },
      { name: 'Brand strategy', importance: 'important', category: 'technical' },
      { name: 'Client management', importance: 'important', category: 'soft' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Advertising, Marketing, Design, Mass Communication', duration: '4 years' }
    ],
    riasec_profile: { realistic: 20, investigative: 50, artistic: 90, social: 65, enterprising: 85, conventional: 30 },
    salary_range: { entry: 60000, median: 150000, experienced: 400000 },
    outlook: { growth: 'growing', demand: 'high' }
  },

  // ── SCIENCE (EXTENDED) ────────────────────────────────────────────────────

  {
    id: 'biochemist',
    name: 'Biochemist / Microbiologist',
    category: 'Science',
    description: 'Studies chemical processes within living organisms. Works in pharmaceutical companies, research labs, hospitals, and the food industry.',
    typical_tasks: [
      'Conduct laboratory experiments',
      'Analyse biological samples',
      'Develop drugs and diagnostic tests',
      'Write research papers',
      'Work on vaccine and medicine development'
    ],
    required_skills: [
      { name: 'Biochemistry and molecular biology', importance: 'essential', category: 'technical' },
      { name: 'Laboratory techniques', importance: 'essential', category: 'technical' },
      { name: 'Data analysis', importance: 'essential', category: 'cognitive' },
      { name: 'Research methodology', importance: 'essential', category: 'technical' },
      { name: 'Attention to detail', importance: 'essential', category: 'soft' }
    ],
    education_pathways: [
      { level: 'master', field: 'Biochemistry, Microbiology', duration: '2 years' },
      { level: 'bachelor', field: 'BS Biochemistry / Microbiology', duration: '4 years' }
    ],
    riasec_profile: { realistic: 45, investigative: 95, artistic: 30, social: 35, enterprising: 30, conventional: 65 },
    salary_range: { entry: 50000, median: 90000, experienced: 180000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
  {
    id: 'agricultural-scientist',
    name: 'Agricultural Scientist',
    category: 'Science',
    description: 'Researches ways to improve crop yields, livestock health, and food security. Extremely relevant for Pakistan, one of the world\'s top agricultural economies.',
    typical_tasks: [
      'Research crop varieties and farming techniques',
      'Advise farmers on best practices',
      'Develop solutions to plant diseases and pests',
      'Conduct field and laboratory experiments',
      'Work with government and NGOs on food policy'
    ],
    required_skills: [
      { name: 'Agricultural science knowledge', importance: 'essential', category: 'technical' },
      { name: 'Field research skills', importance: 'essential', category: 'technical' },
      { name: 'Data analysis', importance: 'important', category: 'cognitive' },
      { name: 'Communication with farmers', importance: 'important', category: 'soft' },
      { name: 'Problem-solving', importance: 'essential', category: 'cognitive' }
    ],
    education_pathways: [
      { level: 'bachelor', field: 'Agriculture (UAF, UAAR, SAU)', duration: '4 years' },
      { level: 'master', field: 'MS Agriculture / Plant Sciences', duration: '2 years' }
    ],
    riasec_profile: { realistic: 70, investigative: 80, artistic: 30, social: 55, enterprising: 40, conventional: 55 },
    salary_range: { entry: 50000, median: 90000, experienced: 180000 },
    outlook: { growth: 'growing', demand: 'high' }
  },
]

export const getCareerById = (id: string): Career | undefined => {
  return careers.find(c => c.id === id)
}

export const getCareersByCategory = (category: string): Career[] => {
  return careers.filter(c => c.category === category)
}
