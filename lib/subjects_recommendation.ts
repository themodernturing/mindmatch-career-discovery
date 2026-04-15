// Subject recommendations mapped to RIASEC 2-letter Holland Code combinations
// Covers all 30 ordered pairs + 6 single-letter fallbacks
//
// Pakistani context:
//   O Level  — Cambridge (CIE) system, age 14–16, typically 8–10 subjects
//              (4 compulsory: English, Urdu, Pakistan Studies, Islamiat)
//              oLevelElectives = recommended elective choices
//   A Level  — Cambridge (CIE) system, age 16–18, typically 3 subjects
//              aLevelSubjects = specific 3-subject combination
//   FSc      — FBISE / Provincial board equivalent stream name
//   University majors — most relevant degree programs

export interface SubjectRecommendation {
  profile: string
  oLevelElectives: string[]        // 4 recommended O Level elective subjects
  aLevelSubjects: string[]         // 3 recommended A Level subjects (specific combo)
  fscStream: string                // FSc / ICS / ICom / FA stream equivalent
  universityMajors: string[]       // top 4 degree programs
  justification: string
}

export function getRecommendedSubjects(topRIASEC: string[]): SubjectRecommendation {
  const code = topRIASEC.slice(0, 2).join('')
  const fallback = topRIASEC[0]

  const map: Record<string, SubjectRecommendation> = {

    // ─── R + I ────────────────────────────────────────────────────────────────
    RI: {
      profile: 'Hands-On / Analytical',
      oLevelElectives: ['Physics', 'Mathematics', 'Computer Science', 'Chemistry'],
      aLevelSubjects: ['Physics', 'Mathematics', 'Computer Science'],
      fscStream: 'FSc Pre-Engineering (Physics, Chemistry, Maths)',
      universityMajors: ['Mechanical Engineering', 'Computer Science', 'Electrical Engineering', 'Software Engineering'],
      justification: 'You combine a love of building things with deep analytical thinking — the classic engineering mindset. Physics and Maths are non-negotiable; Computer Science opens the door to software and systems engineering alongside hardware.',
    },
    IR: {
      profile: 'Analytical / Hands-On',
      oLevelElectives: ['Physics', 'Mathematics', 'Chemistry', 'Computer Science'],
      aLevelSubjects: ['Mathematics', 'Physics', 'Chemistry'],
      fscStream: 'FSc Pre-Engineering (Physics, Chemistry, Maths)',
      universityMajors: ['Data Science', 'Computer Science', 'Electrical Engineering', 'Biomedical Engineering'],
      justification: 'Your analytical drive leads, with a hands-on streak behind it. This combination suits research-heavy engineering fields and applied sciences. A strong Maths-Physics-Chemistry foundation keeps every STEM door open.',
    },

    // ─── R + A ────────────────────────────────────────────────────────────────
    RA: {
      profile: 'Hands-On / Creative',
      oLevelElectives: ['Physics', 'Art & Design', 'Mathematics', 'Computer Science'],
      aLevelSubjects: ['Art & Design', 'Mathematics', 'Physics'],
      fscStream: 'FSc Pre-Engineering + Art elective',
      universityMajors: ['Architecture', 'Industrial Design', 'Product Design', 'Interior Design'],
      justification: 'You want to build things that are also beautiful — that is exactly what architects and industrial designers do. Art & Design builds your portfolio; Physics and Maths give you the structural and spatial reasoning these degrees require at admissions.',
    },
    AR: {
      profile: 'Creative / Hands-On',
      oLevelElectives: ['Art & Design', 'Physics', 'Computer Science', 'Mathematics'],
      aLevelSubjects: ['Art & Design', 'Computer Science', 'Mathematics'],
      fscStream: 'FA (Humanities) with Art + Computer Science',
      universityMajors: ['Architecture', 'Game Design', 'Animation', 'Film Production'],
      justification: 'Creativity is your primary drive, with a practical technical streak. Computer Science opens digital creative fields (game design, animation, 3D); Art & Design builds your portfolio. Maths keeps architecture and technical design programs accessible.',
    },

    // ─── R + S ────────────────────────────────────────────────────────────────
    RS: {
      profile: 'Hands-On / People-Oriented',
      oLevelElectives: ['Biology', 'Chemistry', 'Physics', 'Mathematics'],
      aLevelSubjects: ['Biology', 'Chemistry', 'Physics'],
      fscStream: 'FSc Pre-Medical (Biology, Chemistry, Physics)',
      universityMajors: ['Physical Therapy', 'Sports Science', 'Paramedics', 'Occupational Therapy'],
      justification: 'You want to work with people in a hands-on, physical way — healthcare is the natural fit. The Biology-Chemistry-Physics combination is essential for allied health programs and keeps MBBS accessible if you change your mind.',
    },
    SR: {
      profile: 'People-Oriented / Hands-On',
      oLevelElectives: ['Biology', 'Chemistry', 'Physics', 'Mathematics'],
      aLevelSubjects: ['Biology', 'Chemistry', 'Psychology'],
      fscStream: 'FSc Pre-Medical (Biology, Chemistry, Physics)',
      universityMajors: ['Nursing', 'Physical Therapy', 'Allied Health Sciences', 'Sports Coaching'],
      justification: 'People come first for you, and you want to help them in practical, direct ways. Biology and Chemistry are the core; Psychology at A Level adds depth in understanding people — highly valued in nursing, therapy, and community health roles.',
    },

    // ─── R + E ────────────────────────────────────────────────────────────────
    RE: {
      profile: 'Hands-On / Leadership',
      oLevelElectives: ['Physics', 'Mathematics', 'Economics', 'Business Studies'],
      aLevelSubjects: ['Physics', 'Mathematics', 'Economics'],
      fscStream: 'FSc Pre-Engineering with Economics elective',
      universityMajors: ['Engineering Management', 'Construction Management', 'Real Estate', 'Technical Project Management'],
      justification: 'You want to build things AND run them. This combination bridges engineering and business — leading construction projects, managing technical teams, or owning a technical enterprise. Physics and Maths are your technical foundation; Economics teaches you how the money works.',
    },
    ER: {
      profile: 'Leadership / Hands-On',
      oLevelElectives: ['Physics', 'Business Studies', 'Economics', 'Mathematics'],
      aLevelSubjects: ['Economics', 'Business', 'Physics'],
      fscStream: 'ICom with Physics elective',
      universityMajors: ['Engineering Management', 'Construction Management', 'Technical Sales', 'Entrepreneurship'],
      justification: 'You lead with enterprise and back it with technical knowledge. This mix suits people who want to run technical businesses, manage construction, or drive commercial deals in industrial sectors. Business and Economics are primary; Physics gives you the credibility to speak to engineers.',
    },

    // ─── R + C ────────────────────────────────────────────────────────────────
    RC: {
      profile: 'Hands-On / Organised',
      oLevelElectives: ['Computer Science', 'Physics', 'Mathematics', 'Accounting'],
      aLevelSubjects: ['Computer Science', 'Mathematics', 'Physics'],
      fscStream: 'ICS (Computer Science, Physics, Maths)',
      universityMajors: ['IT Management', 'Quality Engineering', 'Systems Engineering', 'Operations Management'],
      justification: 'You like building systems and running them precisely — IT and quality engineering are your sweet spot. Computer Science with Maths and Physics gives you technical depth plus the logical foundations for operations and systems management.',
    },
    CR: {
      profile: 'Organised / Hands-On',
      oLevelElectives: ['Computer Science', 'Mathematics', 'Physics', 'Accounting'],
      aLevelSubjects: ['Computer Science', 'Mathematics', 'Accounting'],
      fscStream: 'ICS (Computer Science, Physics, Maths)',
      universityMajors: ['IT Management', 'Supply Chain Management', 'Industrial Engineering', 'Operations Management'],
      justification: 'Order and precision lead you, with a practical technical streak. This combination suits supply chain, IT management, and industrial operations roles — fields that need people who understand both systems and physical processes.',
    },

    // ─── I + A ────────────────────────────────────────────────────────────────
    IA: {
      profile: 'Analytical / Creative',
      oLevelElectives: ['Mathematics', 'Computer Science', 'Literature in English', 'History'],
      aLevelSubjects: ['Mathematics', 'Computer Science', 'Psychology'],
      fscStream: 'ICS with Literature or History elective',
      universityMajors: ['Human-Computer Interaction', 'UX/UI Design', 'Psychology', 'Data Journalism'],
      justification: 'You think deeply and express boldly — a rare combination that powers UX design, research, and product strategy. Maths and Computer Science give you technical credibility; Literature or Psychology trains the empathy and communication that great designers and researchers need.',
    },
    AI: {
      profile: 'Creative / Analytical',
      oLevelElectives: ['Literature in English', 'History', 'Psychology', 'Mathematics'],
      aLevelSubjects: ['Literature in English', 'Psychology', 'Sociology'],
      fscStream: 'FA (Humanities) with Psychology',
      universityMajors: ['English Literature', 'Psychology', 'UX/UI Design', 'Anthropology'],
      justification: 'Creativity leads, anchored by intellectual curiosity. Literature and Psychology build the ability to understand human behaviour and tell compelling stories — foundations for UX, research writing, therapy, and human sciences.',
    },

    // ─── I + S ────────────────────────────────────────────────────────────────
    IS: {
      profile: 'Analytical / People-Oriented',
      oLevelElectives: ['Biology', 'Chemistry', 'Mathematics', 'Physics'],
      aLevelSubjects: ['Biology', 'Chemistry', 'Mathematics'],
      fscStream: 'FSc Pre-Medical (Biology, Chemistry, Physics)',
      universityMajors: ['Medicine (MBBS)', 'Public Health', 'Biomedical Sciences', 'Research Psychology'],
      justification: 'You want to understand people scientifically and help them. Medicine is the natural fit — Biology and Chemistry are essential. Maths is increasingly required for medical school admissions and is vital for epidemiology and research-oriented health careers.',
    },
    SI: {
      profile: 'People-Oriented / Analytical',
      oLevelElectives: ['Biology', 'Sociology', 'Psychology', 'Chemistry'],
      aLevelSubjects: ['Biology', 'Psychology', 'Sociology'],
      fscStream: 'FSc Pre-Medical with Sociology elective',
      universityMajors: ['Psychology', 'Sociology', 'Public Health', 'Social Work'],
      justification: 'People come first for you, but you want to understand them analytically. Psychology and Sociology at A Level give you both the scientific method and the social context. Biology keeps health and counselling pathways accessible.',
    },

    // ─── I + E ────────────────────────────────────────────────────────────────
    IE: {
      profile: 'Analytical / Leadership',
      oLevelElectives: ['Mathematics', 'Economics', 'Computer Science', 'Business Studies'],
      aLevelSubjects: ['Mathematics', 'Economics', 'Computer Science'],
      fscStream: 'ICS with Economics elective',
      universityMajors: ['Computer Science', 'Business Analytics', 'Finance', 'Product Management'],
      justification: 'You combine sharp analytical thinking with the drive to lead and build — the profile of a tech founder, product manager, or strategy consultant. Maths and Economics are your power combination; Computer Science opens the technology doors where analytical leaders thrive most right now.',
    },
    EI: {
      profile: 'Leadership / Analytical',
      oLevelElectives: ['Economics', 'Mathematics', 'Business Studies', 'Computer Science'],
      aLevelSubjects: ['Economics', 'Mathematics', 'Business'],
      fscStream: 'ICom with Maths and Computer Science',
      universityMajors: ['Business Administration', 'Finance', 'Economics', 'Strategy Consulting'],
      justification: 'Leadership is your primary drive, backed by a strong analytical mind. Economics and Business give you the macro and operational lenses; Maths gives you the quantitative rigor that separates strong business leaders from average ones in finance and strategy roles.',
    },

    // ─── I + C ────────────────────────────────────────────────────────────────
    IC: {
      profile: 'Analytical / Organised',
      oLevelElectives: ['Mathematics', 'Additional Mathematics', 'Accounting', 'Computer Science'],
      aLevelSubjects: ['Mathematics', 'Further Mathematics', 'Accounting'],
      fscStream: 'ICS (Computer Science, Physics, Maths) or ICom with Further Maths',
      universityMajors: ['Actuarial Science', 'Data Science', 'Accounting & Finance', 'Statistics'],
      justification: 'You love solving complex problems with precision — actuarial science, data science, and advanced accounting are your natural territories. Further Mathematics at A Level signals ambition and opens the most selective analytical degree programs in the country.',
    },
    CI: {
      profile: 'Organised / Analytical',
      oLevelElectives: ['Mathematics', 'Accounting', 'Computer Science', 'Additional Mathematics'],
      aLevelSubjects: ['Mathematics', 'Accounting', 'Computer Science'],
      fscStream: 'ICom with Computer Science and Maths',
      universityMajors: ['Accounting & Finance', 'Data Analytics', 'Actuarial Science', 'IT Audit'],
      justification: 'Precision and structure lead you, backed by strong analytical instincts. Accounting and Maths are your foundation; Computer Science opens the growing intersection of finance and technology — audit analytics, fintech, and data-driven financial management.',
    },

    // ─── A + S ────────────────────────────────────────────────────────────────
    AS: {
      profile: 'Creative / People-Oriented',
      oLevelElectives: ['Literature in English', 'Art & Design', 'Sociology', 'History'],
      aLevelSubjects: ['Literature in English', 'Sociology', 'Psychology'],
      fscStream: 'FA (Humanities) — Literature, Sociology, Psychology',
      universityMajors: ['Education', 'Communication & Media', 'Social Work', 'Counselling Psychology'],
      justification: 'You want to create things that connect and move people. Literature, Sociology and Psychology together build powerful communication skills and deep human understanding — the backbone of education, therapeutic arts, social work, and impactful media.',
    },
    SA: {
      profile: 'People-Oriented / Creative',
      oLevelElectives: ['Literature in English', 'Sociology', 'Art & Design', 'History'],
      aLevelSubjects: ['Sociology', 'Psychology', 'Literature in English'],
      fscStream: 'FA (Humanities) — Literature, Civics, Sociology',
      universityMajors: ['Education', 'Counselling', 'Social Work', 'English Literature'],
      justification: 'You lead with empathy and express through creativity. Sociology and Psychology build your understanding of people; Literature strengthens the communication skills that teachers, counsellors, and community leaders rely on every day.',
    },

    // ─── A + E ────────────────────────────────────────────────────────────────
    AE: {
      profile: 'Creative / Leadership',
      oLevelElectives: ['Art & Design', 'Business Studies', 'Media Studies', 'Literature in English'],
      aLevelSubjects: ['Art & Design', 'Business', 'Media Studies'],
      fscStream: 'FA (Humanities) with Business Studies',
      universityMajors: ['Marketing', 'Media & Communications', 'Fashion Design', 'Creative Entrepreneurship'],
      justification: 'You have a vision and the drive to sell it — the profile of a creative entrepreneur, brand strategist, or creative director. Art & Design is your core; Business teaches you how creative industries are run commercially; Media Studies opens broadcast, digital, and content careers.',
    },
    EA: {
      profile: 'Leadership / Creative',
      oLevelElectives: ['Business Studies', 'Economics', 'Art & Design', 'Media Studies'],
      aLevelSubjects: ['Economics', 'Business', 'Art & Design'],
      fscStream: 'ICom with Art & Design elective',
      universityMajors: ['Marketing', 'Brand Management', 'Architecture', 'Media Production'],
      justification: 'You lead with enterprise but think with a creative mind. Economics and Business give you the commercial foundation; Art & Design differentiates you in brand strategy, marketing, and the growing creative economy where aesthetic intelligence is a competitive advantage.',
    },

    // ─── A + C ────────────────────────────────────────────────────────────────
    AC: {
      profile: 'Creative / Organised',
      oLevelElectives: ['Art & Design', 'Computer Science', 'Mathematics', 'Business Studies'],
      aLevelSubjects: ['Art & Design', 'Computer Science', 'Mathematics'],
      fscStream: 'FA with Computer Science and Maths electives',
      universityMajors: ['Graphic Design', 'Architecture', 'Animation', 'Interior Design'],
      justification: 'You bring structure to creativity — the mark of a strong designer, architect, or animator. Art & Design is your passion; Computer Science (Figma, 3D tools, code) is how modern designers execute; Maths underpins spatial and technical design in architecture and engineering design programs.',
    },
    CA: {
      profile: 'Organised / Creative',
      oLevelElectives: ['Computer Science', 'Art & Design', 'Mathematics', 'Business Studies'],
      aLevelSubjects: ['Computer Science', 'Art & Design', 'Mathematics'],
      fscStream: 'ICS with Art & Design elective',
      universityMajors: ['Interior Design', 'Digital Design', 'UX/UI Design', 'Animation'],
      justification: 'Precision leads, but you express it beautifully. Computer Science and Maths give you technical design tools; Art & Design develops your visual craft. This combination is ideal for digital design, UX, and interior design — fields that reward both accuracy and aesthetics.',
    },

    // ─── S + E ────────────────────────────────────────────────────────────────
    SE: {
      profile: 'People-Oriented / Leadership',
      oLevelElectives: ['History', 'Economics', 'Sociology', 'Literature in English'],
      aLevelSubjects: ['History', 'Economics', 'Political Science'],
      fscStream: 'FA (Humanities) — History, Economics, Political Science',
      universityMajors: ['International Relations', 'Law', 'Public Administration', 'Human Resource Management'],
      justification: 'You want to lead people and change systems — the classic CSS/IAS profile. History, Economics, and Political Science are the three pillars of the CSS exam\'s general knowledge papers. This combination also leads to Law, HR, and international development careers.',
    },
    ES: {
      profile: 'Leadership / People-Oriented',
      oLevelElectives: ['Economics', 'History', 'Business Studies', 'Sociology'],
      aLevelSubjects: ['Economics', 'Business', 'Sociology'],
      fscStream: 'ICom with Sociology and History',
      universityMajors: ['Business Administration', 'Law', 'HR Management', 'Politics & Governance'],
      justification: 'You lead with ambition and connect through people. Economics and Business build your understanding of organisations; Sociology gives you insight into human behaviour at scale — essential for HR, management, and political leadership roles.',
    },

    // ─── S + C ────────────────────────────────────────────────────────────────
    SC: {
      profile: 'People-Oriented / Organised',
      oLevelElectives: ['Sociology', 'Business Studies', 'Computer Science', 'History'],
      aLevelSubjects: ['Business', 'Sociology', 'Psychology'],
      fscStream: 'ICom with Sociology elective',
      universityMajors: ['Human Resource Management', 'Public Administration', 'Social Work', 'Education Management'],
      justification: 'You care about people and want to support them through well-run systems. HR management, public administration, and school management suit you perfectly. Business gives you organisational knowledge; Sociology and Psychology teach you the human dynamics that make organisations work.',
    },
    CS: {
      profile: 'Organised / People-Oriented',
      oLevelElectives: ['Business Studies', 'Sociology', 'Computer Science', 'History'],
      aLevelSubjects: ['Business', 'Computer Science', 'Sociology'],
      fscStream: 'ICom with Computer Science',
      universityMajors: ['Human Resource Management', 'Public Administration', 'Education', 'Social Work'],
      justification: 'Structure and systems are your strength, applied in service of people. Business and Computer Science give you the operational and digital tools; Sociology keeps you grounded in the human context — a valuable blend for HR, education administration, and public sector roles.',
    },

    // ─── E + C ────────────────────────────────────────────────────────────────
    EC: {
      profile: 'Leadership / Organised',
      oLevelElectives: ['Accounting', 'Business Studies', 'Economics', 'Mathematics'],
      aLevelSubjects: ['Accounting', 'Economics', 'Business'],
      fscStream: 'ICom (Accounting, Economics, Business, Maths)',
      universityMajors: ['Chartered Accountancy (CA)', 'Finance', 'Business Analytics', 'Banking & Finance'],
      justification: 'You have the ambition of an entrepreneur and the precision of an accountant — the exact combination the finance industry wants. Accounting and Economics are the foundation; Business rounds out the commercial picture. This path leads directly to CA, which is the highest-value professional qualification in Pakistan\'s corporate sector.',
    },
    CE: {
      profile: 'Organised / Leadership',
      oLevelElectives: ['Accounting', 'Economics', 'Business Studies', 'Mathematics'],
      aLevelSubjects: ['Accounting', 'Business', 'Economics'],
      fscStream: 'ICom (Accounting, Economics, Business, Maths)',
      universityMajors: ['Accounting & Finance', 'Supply Chain Management', 'Business Analytics', 'Actuarial Science'],
      justification: 'Precision drives you, with the ambition to lead. The Accounting-Business-Economics trio gives you the strongest possible foundation for the corporate world — finance, supply chain, and operations are fields where organised leaders consistently outperform.',
    },

    // ─── Single-letter fallbacks (used when top 2 codes are unavailable) ──────

    R: {
      profile: 'Hands-On (Technical)',
      oLevelElectives: ['Physics', 'Mathematics', 'Computer Science', 'Additional Mathematics'],
      aLevelSubjects: ['Physics', 'Mathematics', 'Computer Science'],
      fscStream: 'FSc Pre-Engineering (Physics, Chemistry, Maths) or ICS',
      universityMajors: ['Mechanical Engineering', 'Civil Engineering', 'Computer Science', 'Architecture'],
      justification: 'You excel with tangible, physical, and practical systems. Physics and Maths are non-negotiable; Computer Science adds a modern technical dimension to your hands-on instincts.',
    },
    I: {
      profile: 'Analytical (Investigative)',
      oLevelElectives: ['Mathematics', 'Physics', 'Computer Science', 'Economics'],
      aLevelSubjects: ['Mathematics', 'Physics', 'Computer Science'],
      fscStream: 'FSc Pre-Engineering or ICS',
      universityMajors: ['Computer Science', 'Data Science', 'Economics', 'Engineering'],
      justification: 'Your analytical drive is your greatest asset. Mathematics, Physics, and Computer Science challenge and develop it — and they keep the highest-value degree programs accessible.',
    },
    A: {
      profile: 'Creative (Artistic)',
      oLevelElectives: ['Art & Design', 'Literature in English', 'Media Studies', 'History'],
      aLevelSubjects: ['Art & Design', 'Literature in English', 'Media Studies'],
      fscStream: 'FA (Humanities) with Art & Design',
      universityMajors: ['Fine Arts', 'Media Sciences', 'Architecture', 'Marketing'],
      justification: 'Your creative instincts need subjects that give them room to develop. Art & Design, Literature, and Media Studies build both the portfolio and the communication skills that creative careers require.',
    },
    S: {
      profile: 'People-Oriented (Social)',
      oLevelElectives: ['Sociology', 'Biology', 'Literature in English', 'Psychology'],
      aLevelSubjects: ['Biology', 'Psychology', 'Sociology'],
      fscStream: 'FSc Pre-Medical or FA with Psychology',
      universityMajors: ['Psychology', 'Medicine', 'Education', 'Social Work'],
      justification: 'Your empathy and interest in people align naturally with the social and life sciences. Biology keeps health pathways open; Psychology and Sociology build understanding of human behaviour at individual and community levels.',
    },
    E: {
      profile: 'Leadership (Enterprising)',
      oLevelElectives: ['Economics', 'Business Studies', 'Accounting', 'History'],
      aLevelSubjects: ['Economics', 'Business', 'Accounting'],
      fscStream: 'ICom (Accounting, Economics, Business, Maths)',
      universityMajors: ['Business Administration', 'Law', 'Finance', 'International Relations'],
      justification: 'Your ambition and leadership instincts are best developed through subjects that explain how markets, organisations, and societies operate. Economics, Business, and Accounting form the strongest commercial foundation available at A Level.',
    },
    C: {
      profile: 'Organised (Conventional)',
      oLevelElectives: ['Accounting', 'Mathematics', 'Computer Science', 'Business Studies'],
      aLevelSubjects: ['Accounting', 'Mathematics', 'Computer Science'],
      fscStream: 'ICom or ICS',
      universityMajors: ['Accounting & Finance', 'Actuarial Science', 'IT Management', 'Supply Chain Management'],
      justification: 'Your precision and organisational ability are rare strengths. Accounting and Maths develop your quantitative accuracy; Computer Science adds the systems thinking that makes organised professionals especially valuable in the digital economy.',
    },
  }

  return map[code] ?? map[fallback] ?? map['I']
}
