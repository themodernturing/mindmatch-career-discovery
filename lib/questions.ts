import { Question } from './types';

// PHASE A: CORE SIGNAL (30 Questions - 3 variations per original archetype)
export const coreQuestions: Question[] = [
  // Investigative (Behavioral) - 3 Variations
  { id: 101, section: 'interest_exploration', category: 'core', text: 'I enjoy analyzing complex systems to figure out exactly how they work.', dimensions: [{ dimension: 'riasec_investigative', weight: 4 }, { dimension: 'strength_analytical_thinking', weight: 2 }], reverse_scored: false, active: true, tags: ['investigative', 'analytical'] },
  { id: 102, section: 'interest_exploration', category: 'core', text: 'When faced with a difficult subject, I will relentlessly research it until I understand the first principles.', dimensions: [{ dimension: 'riasec_investigative', weight: 4 }, { dimension: 'strength_analytical_thinking', weight: 2 }], reverse_scored: false, active: true, tags: ['investigative', 'analytical'] },
  { id: 103, section: 'interest_exploration', category: 'core', text: 'I prefer work that requires deep, uninterrupted thinking over constant collaboration.', dimensions: [{ dimension: 'riasec_investigative', weight: 4 }, { dimension: 'strength_analytical_thinking', weight: 2 }], reverse_scored: false, active: true, tags: ['investigative', 'analytical'] },

  // Artistic (Behavioral) - 3 Variations
  { id: 104, section: 'interest_exploration', category: 'core', text: 'I frequently create, design, or write things to express my original ideas.', dimensions: [{ dimension: 'riasec_artistic', weight: 4 }, { dimension: 'strength_creativity', weight: 2 }], reverse_scored: false, active: true, tags: ['artistic', 'creativity'] },
  { id: 105, section: 'interest_exploration', category: 'core', text: 'I feel suffocated in environments where I am not allowed to inject my own creative style into my work.', dimensions: [{ dimension: 'riasec_artistic', weight: 4 }, { dimension: 'strength_creativity', weight: 2 }], reverse_scored: false, active: true, tags: ['artistic', 'creativity'] },
  { id: 106, section: 'interest_exploration', category: 'core', text: 'I am drawn to abstract concepts and producing work that makes people feel something.', dimensions: [{ dimension: 'riasec_artistic', weight: 4 }, { dimension: 'strength_creativity', weight: 2 }], reverse_scored: false, active: true, tags: ['artistic', 'creativity'] },

  // Social (Behavioral) - 3 Variations
  { id: 107, section: 'interest_exploration', category: 'core', text: 'People consistently seek me out when they need empathy, advice, or support.', dimensions: [{ dimension: 'riasec_social', weight: 4 }, { dimension: 'strength_empathy', weight: 3 }], reverse_scored: false, active: true, tags: ['social', 'empathy'] },
  { id: 108, section: 'interest_exploration', category: 'core', text: 'I naturally sense when someone in my group is feeling left out or overwhelmed.', dimensions: [{ dimension: 'riasec_social', weight: 4 }, { dimension: 'strength_empathy', weight: 3 }], reverse_scored: false, active: true, tags: ['social', 'empathy'] },
  { id: 109, section: 'interest_exploration', category: 'core', text: 'The most rewarding part of my week is usually a conversation where I helped someone solve a personal problem.', dimensions: [{ dimension: 'riasec_social', weight: 4 }, { dimension: 'strength_empathy', weight: 3 }], reverse_scored: false, active: true, tags: ['social', 'empathy'] },

  // Enterprising (Behavioral) - 3 Variations
  { id: 110, section: 'interest_exploration', category: 'core', text: 'I naturally take charge of groups and enjoy persuading others to follow my vision.', dimensions: [{ dimension: 'riasec_enterprising', weight: 4 }, { dimension: 'strength_leadership', weight: 3 }], reverse_scored: false, active: true, tags: ['enterprising', 'leadership'] },
  { id: 111, section: 'interest_exploration', category: 'core', text: 'I am energized by negotiating deals, winning arguments, or closing sales.', dimensions: [{ dimension: 'riasec_enterprising', weight: 4 }, { dimension: 'strength_leadership', weight: 3 }], reverse_scored: false, active: true, tags: ['enterprising', 'leadership'] },
  { id: 112, section: 'interest_exploration', category: 'core', text: 'When a project lacks direction, I have no problem stepping up and telling people what to do.', dimensions: [{ dimension: 'riasec_enterprising', weight: 4 }, { dimension: 'strength_leadership', weight: 3 }], reverse_scored: false, active: true, tags: ['enterprising', 'leadership'] },

  // Realistic (Behavioral) - 3 Core Variations (added to guarantee early R sampling)
  { id: 167, section: 'interest_exploration', category: 'core', text: 'I enjoy working with physical tools, materials, or equipment rather than just ideas or people.', dimensions: [{ dimension: 'riasec_realistic', weight: 4 }], reverse_scored: false, active: true, tags: ['realistic'] },
  { id: 168, section: 'interest_exploration', category: 'core', text: 'I feel most satisfied when I can see or touch the result of my work at the end of the day.', dimensions: [{ dimension: 'riasec_realistic', weight: 4 }], reverse_scored: false, active: true, tags: ['realistic'] },
  { id: 169, section: 'interest_exploration', category: 'core', text: 'Hands-on tasks like building, repairing, or assembling things appeal to me more than desk-based tasks.', dimensions: [{ dimension: 'riasec_realistic', weight: 4 }], reverse_scored: false, active: true, tags: ['realistic'] },

  // Conventional (Behavioral) - 3 Core Variations (added to guarantee early C sampling)
  { id: 170, section: 'interest_exploration', category: 'core', text: 'I prefer work that has clear rules, defined steps, and predictable outcomes.', dimensions: [{ dimension: 'riasec_conventional', weight: 4 }, { dimension: 'strength_organization', weight: 2 }], reverse_scored: false, active: true, tags: ['conventional', 'organization'] },
  { id: 171, section: 'interest_exploration', category: 'core', text: 'I like managing data, records, and organized systems more than creative or open-ended tasks.', dimensions: [{ dimension: 'riasec_conventional', weight: 4 }, { dimension: 'strength_organization', weight: 2 }], reverse_scored: false, active: true, tags: ['conventional', 'organization'] },
  { id: 172, section: 'interest_exploration', category: 'core', text: 'Accuracy and attention to detail matter more to me than generating new ideas.', dimensions: [{ dimension: 'riasec_conventional', weight: 4 }, { dimension: 'strength_organization', weight: 2 }], reverse_scored: false, active: true, tags: ['conventional', 'organization'] },


  { id: 113, section: 'personality_traits', category: 'core', text: 'I actively seek out unconventional ideas and completely new experiences.', dimensions: [{ dimension: 'big5_openness', weight: 3 }], reverse_scored: false, active: true, tags: ['openness'] },
  { id: 114, section: 'personality_traits', category: 'core', text: 'I get bored quickly if I am forced to follow the same routine every single day.', dimensions: [{ dimension: 'big5_openness', weight: 3 }], reverse_scored: false, active: true, tags: ['openness'] },
  { id: 115, section: 'personality_traits', category: 'core', text: 'I love philosophical discussions and theoretical debates, even if they have no practical application.', dimensions: [{ dimension: 'big5_openness', weight: 3 }], reverse_scored: false, active: true, tags: ['openness'] },

  // Big Five Conscientiousness (Behavioral) - 3 Variations
  { id: 116, section: 'personality_traits', category: 'core', text: 'I build detailed plans and rarely miss a commitment or detail.', dimensions: [{ dimension: 'big5_conscientiousness', weight: 4 }, { dimension: 'strength_organization', weight: 2 }], reverse_scored: false, active: true, tags: ['conscientiousness', 'organization'] },
  { id: 117, section: 'personality_traits', category: 'core', text: 'My workspace and digital files are meticulously organized.', dimensions: [{ dimension: 'big5_conscientiousness', weight: 4 }, { dimension: 'strength_organization', weight: 2 }], reverse_scored: false, active: true, tags: ['conscientiousness', 'organization'] },
  { id: 118, section: 'personality_traits', category: 'core', text: 'I find it highly stressful when people are late or fail to deliver what they promised.', dimensions: [{ dimension: 'big5_conscientiousness', weight: 4 }, { dimension: 'strength_organization', weight: 2 }], reverse_scored: false, active: true, tags: ['conscientiousness', 'organization'] },

  // Strength: Analytical / Problem Solving - 3 Variations
  { id: 119, section: 'strength_identification', category: 'core', text: 'I am known for breaking massive, confusing problems down into logical steps.', dimensions: [{ dimension: 'strength_analytical_thinking', weight: 4 }], reverse_scored: false, active: true, tags: ['analytical'] },
  { id: 120, section: 'strength_identification', category: 'core', text: 'I rarely make decisions based on "gut feeling"; I need cold, hard data.', dimensions: [{ dimension: 'strength_analytical_thinking', weight: 4 }], reverse_scored: false, active: true, tags: ['analytical'] },
  { id: 121, section: 'strength_identification', category: 'core', text: 'I can quickly spot logical flaws or missing pieces in someone else\'s argument.', dimensions: [{ dimension: 'strength_analytical_thinking', weight: 4 }], reverse_scored: false, active: true, tags: ['analytical'] },

  // Strength: Communication - 3 Variations
  { id: 122, section: 'strength_identification', category: 'core', text: 'I can take highly complex information and explain it so anyone can understand.', dimensions: [{ dimension: 'strength_communication', weight: 4 }], reverse_scored: false, active: true, tags: ['communication'] },
  { id: 123, section: 'strength_identification', category: 'core', text: 'I am frequently asked to present ideas, write reports, or speak on behalf of my team.', dimensions: [{ dimension: 'strength_communication', weight: 4 }], reverse_scored: false, active: true, tags: ['communication'] },
  { id: 124, section: 'strength_identification', category: 'core', text: 'I am hyper-aware of my audience and naturally adjust my tone and vocabulary to fit them.', dimensions: [{ dimension: 'strength_communication', weight: 4 }], reverse_scored: false, active: true, tags: ['communication'] },

  // Work Style: Structure vs Autonomy - 3 Variations
  { id: 125, section: 'work_style_preferences', category: 'core', text: 'I produce my best work when I am given complete freedom and no rigid processes.', dimensions: [{ dimension: 'work_independence', weight: 4 }, { dimension: 'work_structure', weight: -3 }], reverse_scored: false, active: true, tags: ['independence', 'structure'] },
  { id: 126, section: 'work_style_preferences', category: 'core', text: 'Micromanagement is the fastest way to destroy my motivation and productivity.', dimensions: [{ dimension: 'work_independence', weight: 4 }, { dimension: 'work_structure', weight: -3 }], reverse_scored: false, active: true, tags: ['independence', 'structure'] },
  { id: 127, section: 'work_style_preferences', category: 'core', text: 'I would rather invent a new way to do something than follow an outdated manual.', dimensions: [{ dimension: 'work_independence', weight: 4 }, { dimension: 'work_structure', weight: -3 }], reverse_scored: false, active: true, tags: ['independence', 'structure'] },

  // Motivation: Achievement vs Helping - 3 Variations
  { id: 128, section: 'motivation_drivers', category: 'core', text: 'Making a direct, positive impact on others motivates me more than wealth or personal status.', dimensions: [{ dimension: 'motivation_helping', weight: 4 }, { dimension: 'motivation_financial', weight: -2 }], reverse_scored: false, active: true, tags: ['helping', 'financial'] },
  { id: 129, section: 'motivation_drivers', category: 'core', text: 'I measure a successful day by how many people I was able to assist or uplift.', dimensions: [{ dimension: 'motivation_helping', weight: 4 }, { dimension: 'motivation_financial', weight: -2 }], reverse_scored: false, active: true, tags: ['helping', 'financial'] },
  { id: 130, section: 'motivation_drivers', category: 'core', text: 'I would turn down a significant salary increase if it meant working for a company that harmed society.', dimensions: [{ dimension: 'motivation_helping', weight: 4 }, { dimension: 'motivation_financial', weight: -2 }], reverse_scored: false, active: true, tags: ['helping', 'financial'] }
];

// PHASE B: ADAPTIVE REFINEMENT (36 Questions - 3 variations per original archetype)
export const branchQuestions: Question[] = [
  // Realistic - 3 Variations
  { id: 131, section: 'interest_exploration', category: 'branch', text: 'I prefer working with my hands, building physical things, or operating equipment.', dimensions: [{ dimension: 'riasec_realistic', weight: 4 }], reverse_scored: false, active: true, tags: ['realistic'] },
  { id: 132, section: 'interest_exploration', category: 'branch', text: 'Sitting at a desk all day sounds miserable compared to being out in the field.', dimensions: [{ dimension: 'riasec_realistic', weight: 4 }], reverse_scored: false, active: true, tags: ['realistic'] },
  { id: 133, section: 'interest_exploration', category: 'branch', text: 'I learn by taking things apart and putting them back together, not by reading manuals.', dimensions: [{ dimension: 'riasec_realistic', weight: 4 }], reverse_scored: false, active: true, tags: ['realistic'] },

  // Conventional - 3 Variations
  { id: 134, section: 'interest_exploration', category: 'branch', text: 'I enjoy managing structured systems, organizing data, and ensuring protocols are followed.', dimensions: [{ dimension: 'riasec_conventional', weight: 4 }, { dimension: 'strength_organization', weight: 2 }], reverse_scored: false, active: true, tags: ['conventional', 'organization'] },
  { id: 135, section: 'interest_exploration', category: 'branch', text: 'I find deep satisfaction in cleaning up a messy, disorganized process.', dimensions: [{ dimension: 'riasec_conventional', weight: 4 }, { dimension: 'strength_organization', weight: 2 }], reverse_scored: false, active: true, tags: ['conventional', 'organization'] },
  { id: 136, section: 'interest_exploration', category: 'branch', text: 'Following clear, documented procedures is much more efficient than constantly improvising.', dimensions: [{ dimension: 'riasec_conventional', weight: 4 }, { dimension: 'strength_organization', weight: 2 }], reverse_scored: false, active: true, tags: ['conventional', 'organization'] },

  // Big Five Extraversion - 3 Variations
  { id: 137, section: 'personality_traits', category: 'branch', text: 'I feel deeply energized after spending extended time talking to large groups of people.', dimensions: [{ dimension: 'big5_extraversion', weight: 4 }], reverse_scored: false, active: true, tags: ['extraversion'] },
  { id: 138, section: 'personality_traits', category: 'branch', text: 'I am often the first person to speak up and introduce myself in a room full of strangers.', dimensions: [{ dimension: 'big5_extraversion', weight: 4 }], reverse_scored: false, active: true, tags: ['extraversion'] },
  { id: 139, section: 'personality_traits', category: 'branch', text: 'Working in total isolation for a full week would drain my energy and motivation completely.', dimensions: [{ dimension: 'big5_extraversion', weight: 4 }], reverse_scored: false, active: true, tags: ['extraversion'] },

  // Big Five Agreeableness - 3 Variations
  { id: 140, section: 'personality_traits', category: 'branch', text: 'I will often compromise my own goals to ensure group harmony and avoid conflict.', dimensions: [{ dimension: 'big5_agreeableness', weight: 3 }], reverse_scored: false, active: true, tags: ['agreeableness'] },
  { id: 141, section: 'personality_traits', category: 'branch', text: 'I find it extremely difficult to give a colleague harsh negative feedback.', dimensions: [{ dimension: 'big5_agreeableness', weight: 3 }], reverse_scored: false, active: true, tags: ['agreeableness'] },
  { id: 142, section: 'personality_traits', category: 'branch', text: 'My coworkers would describe me as accommodating, warm, and highly cooperative.', dimensions: [{ dimension: 'big5_agreeableness', weight: 3 }], reverse_scored: false, active: true, tags: ['agreeableness'] },

  // Strength: Creativity Refinement - 3 Variations
  { id: 143, section: 'strength_identification', category: 'branch', text: 'I consistently generate original ideas that others in my field haven\'t thought of.', dimensions: [{ dimension: 'strength_creativity', weight: 4 }, { dimension: 'big5_openness', weight: 2 }], reverse_scored: false, active: true, tags: ['creativity'] },
  { id: 144, section: 'strength_identification', category: 'branch', text: 'When a standard approach fails, I am usually the first one to invent a radically different solution.', dimensions: [{ dimension: 'strength_creativity', weight: 4 }, { dimension: 'big5_openness', weight: 2 }], reverse_scored: false, active: true, tags: ['creativity'] },
  { id: 145, section: 'strength_identification', category: 'branch', text: 'My best work happens when I am allowed to brainstorm without boundaries or constraints.', dimensions: [{ dimension: 'strength_creativity', weight: 4 }, { dimension: 'big5_openness', weight: 2 }], reverse_scored: false, active: true, tags: ['creativity'] },

  // Strength: Leadership Refinement - 3 Variations
  { id: 146, section: 'strength_identification', category: 'branch', text: 'I am comfortable making hard decisions that affect the direction of a whole team.', dimensions: [{ dimension: 'strength_leadership', weight: 4 }], reverse_scored: false, active: true, tags: ['leadership'] },
  { id: 147, section: 'strength_identification', category: 'branch', text: 'When things go wrong, people naturally look to me for the next steps.', dimensions: [{ dimension: 'strength_leadership', weight: 4 }], reverse_scored: false, active: true, tags: ['leadership'] },
  { id: 148, section: 'strength_identification', category: 'branch', text: 'I am willing to shoulder the blame for a failure if it protects the people working under me.', dimensions: [{ dimension: 'strength_leadership', weight: 4 }], reverse_scored: false, active: true, tags: ['leadership'] },

  // Work Style: Pace - 3 Variations
  { id: 149, section: 'work_style_preferences', category: 'branch', text: 'I thrive in high-pressure, fast-paced environments where things change constantly.', dimensions: [{ dimension: 'work_pace', weight: 4 }, { dimension: 'big5_emotional_stability', weight: 2 }], reverse_scored: false, active: true, tags: ['pace'] },
  { id: 150, section: 'work_style_preferences', category: 'branch', text: 'A slow, predictable workday with no crises feels unbearably boring to me.', dimensions: [{ dimension: 'work_pace', weight: 4 }, { dimension: 'big5_emotional_stability', weight: 2 }], reverse_scored: false, active: true, tags: ['pace'] },
  { id: 151, section: 'work_style_preferences', category: 'branch', text: 'I do my best thinking when a critical deadline is rapidly approaching.', dimensions: [{ dimension: 'work_pace', weight: 4 }, { dimension: 'big5_emotional_stability', weight: 2 }], reverse_scored: false, active: true, tags: ['pace'] },

  // Motivation: Autonomy - 3 Variations
  { id: 152, section: 'motivation_drivers', category: 'branch', text: 'Having total control over how and when I execute my tasks is essential to me.', dimensions: [{ dimension: 'motivation_autonomy', weight: 4 }], reverse_scored: false, active: true, tags: ['autonomy'] },
  { id: 153, section: 'motivation_drivers', category: 'branch', text: 'I would accept a lower salary if it meant I could work completely independently without oversight.', dimensions: [{ dimension: 'motivation_autonomy', weight: 4 }], reverse_scored: false, active: true, tags: ['autonomy'] },
  { id: 154, section: 'motivation_drivers', category: 'branch', text: 'Reporting my every move to a manager feels degrading and kills my motivation.', dimensions: [{ dimension: 'motivation_autonomy', weight: 4 }], reverse_scored: false, active: true, tags: ['autonomy'] },

  // Investigative Refinement - 3 Variations
  { id: 155, section: 'interest_exploration', category: 'branch', text: 'I spend my free time learning difficult, technical, or scientific concepts.', dimensions: [{ dimension: 'riasec_investigative', weight: 3 }], reverse_scored: false, active: true, tags: ['investigative'] },
  { id: 156, section: 'interest_exploration', category: 'branch', text: 'My ideal weekend involves deep-diving into a complex topic, reading academic papers, or exploring data.', dimensions: [{ dimension: 'riasec_investigative', weight: 3 }], reverse_scored: false, active: true, tags: ['investigative'] },
  { id: 157, section: 'interest_exploration', category: 'branch', text: 'I am much more interested in knowing *why* something happens than just accepting that it does.', dimensions: [{ dimension: 'riasec_investigative', weight: 3 }], reverse_scored: false, active: true, tags: ['investigative'] },

  // Social Refinement - 3 Variations
  { id: 158, section: 'interest_exploration', category: 'branch', text: 'Mentoring, teaching, and helping others grow is my favorite part of any job.', dimensions: [{ dimension: 'riasec_social', weight: 4 }], reverse_scored: false, active: true, tags: ['social'] },
  { id: 159, section: 'interest_exploration', category: 'branch', text: 'I am frequently asked by colleagues to help them navigate difficult interpersonal conflicts.', dimensions: [{ dimension: 'riasec_social', weight: 4 }], reverse_scored: false, active: true, tags: ['social'] },
  { id: 160, section: 'interest_exploration', category: 'branch', text: 'I view my own success primarily through the lens of how many people I have helped advance their lives.', dimensions: [{ dimension: 'riasec_social', weight: 4 }], reverse_scored: false, active: true, tags: ['social'] },

  // Enterprising Refinement - 3 Variations
  { id: 161, section: 'interest_exploration', category: 'branch', text: 'I enjoy the challenge of negotiating deals or selling concepts to skeptical people.', dimensions: [{ dimension: 'riasec_enterprising', weight: 4 }], reverse_scored: false, active: true, tags: ['enterprising'] },
  { id: 162, section: 'interest_exploration', category: 'branch', text: 'I am highly focused on ascending to executive or C-suite levels of leadership.', dimensions: [{ dimension: 'riasec_enterprising', weight: 4 }], reverse_scored: false, active: true, tags: ['enterprising'] },
  { id: 163, section: 'interest_exploration', category: 'branch', text: 'When someone says "no," I view it as an exciting challenge to overcome rather than a defeat.', dimensions: [{ dimension: 'riasec_enterprising', weight: 4 }], reverse_scored: false, active: true, tags: ['enterprising'] },

  // Artistic Refinement - 3 Variations
  { id: 164, section: 'interest_exploration', category: 'branch', text: 'I am highly sensitive to aesthetics, design, and visual harmony in my environment.', dimensions: [{ dimension: 'riasec_artistic', weight: 3 }], reverse_scored: false, active: true, tags: ['artistic'] },
  { id: 165, section: 'interest_exploration', category: 'branch', text: 'I would rather produce one beautiful, imperfect thing than mass-produce something heavily standardized.', dimensions: [{ dimension: 'riasec_artistic', weight: 3 }], reverse_scored: false, active: true, tags: ['artistic'] },
  { id: 166, section: 'interest_exploration', category: 'branch', text: 'The way a presentation or document looks is just as important to me as what it actually says.', dimensions: [{ dimension: 'riasec_artistic', weight: 3 }], reverse_scored: false, active: true, tags: ['artistic'] }
];

// PHASE C: CLARIFICATION / FORCED TRADE-OFF (24 Questions - 3 variations per original archetype)
export const clarifierQuestions: Question[] = [
  // 1. Investigative vs Artistic - 3 Variations
  { id: 201, section: 'cognitive_style', category: 'clarifier', text: 'Which sounds more satisfying: Discovering hidden patterns in raw data (1) OR Designing visually engaging digital experiences (5)?', dimensions: [{ dimension: 'riasec_artistic', weight: 4 }, { dimension: 'riasec_investigative', weight: -4 }], reverse_scored: false, active: true, tags: ['artistic', 'investigative'], discriminatesBetween: ['riasec_investigative', 'riasec_artistic'] },
  { id: 202, section: 'cognitive_style', category: 'clarifier', text: 'If forced to choose, would you rather be remembered for: A scientific breakthrough that solved a technical mystery (1) OR A work of art that inspired a generation (5)?', dimensions: [{ dimension: 'riasec_artistic', weight: 4 }, { dimension: 'riasec_investigative', weight: -4 }], reverse_scored: false, active: true, tags: ['artistic', 'investigative'], discriminatesBetween: ['riasec_investigative', 'riasec_artistic'] },
  { id: 203, section: 'cognitive_style', category: 'clarifier', text: 'Would you rather spend your day: Perfecting the logic of a complex algorithm (1) OR Perfecting the aesthetics of a user interface (5)?', dimensions: [{ dimension: 'riasec_artistic', weight: 4 }, { dimension: 'riasec_investigative', weight: -4 }], reverse_scored: false, active: true, tags: ['artistic', 'investigative'], discriminatesBetween: ['riasec_investigative', 'riasec_artistic'] },

  // 2. Social vs Enterprising - 3 Variations
  { id: 204, section: 'cognitive_style', category: 'clarifier', text: 'Which do you prefer: Mentoring individuals to help them grow (1) OR Persuading large groups to follow your strategy (5)?', dimensions: [{ dimension: 'riasec_enterprising', weight: 4 }, { dimension: 'riasec_social', weight: -4 }], reverse_scored: false, active: true, tags: ['enterprising', 'social'], discriminatesBetween: ['riasec_social', 'riasec_enterprising'] },
  { id: 205, section: 'cognitive_style', category: 'clarifier', text: 'Would you rather: Be the supportive counselor who hears everyone\'s story (1) OR The assertive negotiator who closes the million-dollar deal (5)?', dimensions: [{ dimension: 'riasec_enterprising', weight: 4 }, { dimension: 'riasec_social', weight: -4 }], reverse_scored: false, active: true, tags: ['enterprising', 'social'], discriminatesBetween: ['riasec_social', 'riasec_enterprising'] },
  { id: 206, section: 'cognitive_style', category: 'clarifier', text: 'Is your primary goal: Ensuring that everyone on the team feels supported and heard (1) OR Ensuring that the team wins at all costs (5)?', dimensions: [{ dimension: 'riasec_enterprising', weight: 4 }, { dimension: 'riasec_social', weight: -4 }], reverse_scored: false, active: true, tags: ['enterprising', 'social'], discriminatesBetween: ['riasec_social', 'riasec_enterprising'] },

  // 3. Analytical vs Leadership - 3 Variations
  { id: 207, section: 'work_style_preferences', category: 'clarifier', text: 'Which role appeals more: Becoming the singular technical expert (1) OR Managing the experts to deliver a project (5)?', dimensions: [{ dimension: 'strength_leadership', weight: 4 }, { dimension: 'strength_analytical_thinking', weight: -4 }], reverse_scored: false, active: true, tags: ['leadership', 'analytical'], discriminatesBetween: ['strength_analytical_thinking', 'strength_leadership'] },
  { id: 208, section: 'work_style_preferences', category: 'clarifier', text: 'If a project is failing, would you rather: Be assigned to find the technical bug yourself (1) OR Be given the authority to reorganize the team to fix it (5)?', dimensions: [{ dimension: 'strength_leadership', weight: 4 }, { dimension: 'strength_analytical_thinking', weight: -4 }], reverse_scored: false, active: true, tags: ['leadership', 'analytical'], discriminatesBetween: ['strength_analytical_thinking', 'strength_leadership'] },
  { id: 209, section: 'work_style_preferences', category: 'clarifier', text: 'Do you get more satisfaction from: Solving a puzzle that everyone else gave up on (1) OR Inspiring a team to achieve a goal they thought was impossible (5)?', dimensions: [{ dimension: 'strength_leadership', weight: 4 }, { dimension: 'strength_analytical_thinking', weight: -4 }], reverse_scored: false, active: true, tags: ['leadership', 'analytical'], discriminatesBetween: ['strength_analytical_thinking', 'strength_leadership'] },

  // 4. Structure vs Autonomy - 3 Variations
  { id: 210, section: 'work_style_preferences', category: 'clarifier', text: 'I work best when: The rules and expectations are perfectly clear (1) OR I invent the rules as I go (5)?', dimensions: [{ dimension: 'motivation_autonomy', weight: 4 }, { dimension: 'work_structure', weight: -4 }], reverse_scored: false, active: true, tags: ['autonomy', 'structure'], discriminatesBetween: ['motivation_autonomy', 'work_structure'] },
  { id: 211, section: 'work_style_preferences', category: 'clarifier', text: 'Would you rather: Have a detailed roadmap and a manager who gives quick feedback (1) OR Be given a vague goal and told to "figure it out" (5)?', dimensions: [{ dimension: 'motivation_autonomy', weight: 4 }, { dimension: 'work_structure', weight: -4 }], reverse_scored: false, active: true, tags: ['autonomy', 'structure'], discriminatesBetween: ['motivation_autonomy', 'work_structure'] },
  { id: 212, section: 'work_style_preferences', category: 'clarifier', text: 'I value: Stability, predictability, and knowing exactly what my week looks like (1) OR Freedom, risk-taking, and the ability to pivot at any moment (5)?', dimensions: [{ dimension: 'motivation_autonomy', weight: 4 }, { dimension: 'work_structure', weight: -4 }], reverse_scored: false, active: true, tags: ['autonomy', 'structure'], discriminatesBetween: ['motivation_autonomy', 'work_structure'] },

  // 5. Realistic vs Conventional - 3 Variations
  { id: 213, section: 'cognitive_style', category: 'clarifier', text: 'Which sounds better: Being on your feet building physical objects (1) OR Sitting at a desk optimizing spreadsheets (5)?', dimensions: [{ dimension: 'riasec_conventional', weight: 4 }, { dimension: 'riasec_realistic', weight: -4 }], reverse_scored: false, active: true, tags: ['conventional', 'realistic'], discriminatesBetween: ['riasec_realistic', 'riasec_conventional'] },
  { id: 214, section: 'cognitive_style', category: 'clarifier', text: 'If assigned to a skyscraper project, would you rather: Be the engineer on-site inspecting the steel beams (1) OR The project controller managing the budget and logs (5)?', dimensions: [{ dimension: 'riasec_conventional', weight: 4 }, { dimension: 'riasec_realistic', weight: -4 }], reverse_scored: false, active: true, tags: ['conventional', 'realistic'], discriminatesBetween: ['riasec_realistic', 'riasec_conventional'] },
  { id: 215, section: 'cognitive_style', category: 'clarifier', text: 'I prefer working with: Concrete tools and tangible materials (1) OR Digital records and organized data sets (5)?', dimensions: [{ dimension: 'riasec_conventional', weight: 4 }, { dimension: 'riasec_realistic', weight: -4 }], reverse_scored: false, active: true, tags: ['conventional', 'realistic'], discriminatesBetween: ['riasec_realistic', 'riasec_conventional'] },

  // 6. Helping vs Achievement - 3 Variations
  { id: 216, section: 'motivation_drivers', category: 'clarifier', text: 'Which matters more at the end of your career: The number of lives you changed (1) OR The scale of the empire you built (5)?', dimensions: [{ dimension: 'motivation_achievement', weight: 4 }, { dimension: 'motivation_helping', weight: -4 }], reverse_scored: false, active: true, tags: ['achievement', 'helping'], discriminatesBetween: ['motivation_helping', 'motivation_achievement'] },
  { id: 217, section: 'motivation_drivers', category: 'clarifier', text: 'Would you rather: Receive a "thank you" from a person whose life you saved (1) OR Be named "Entrepreneur of the Year" for a massive business exit (5)?', dimensions: [{ dimension: 'motivation_achievement', weight: 4 }, { dimension: 'motivation_helping', weight: -4 }], reverse_scored: false, active: true, tags: ['achievement', 'helping'], discriminatesBetween: ['motivation_helping', 'motivation_achievement'] },
  { id: 218, section: 'motivation_drivers', category: 'clarifier', text: 'Is your definition of success: Bringing peace and well-being to your community (1) OR Dominating your industry and becoming a global leader (5)?', dimensions: [{ dimension: 'motivation_achievement', weight: 4 }, { dimension: 'motivation_helping', weight: -4 }], reverse_scored: false, active: true, tags: ['achievement', 'helping'], discriminatesBetween: ['motivation_helping', 'motivation_achievement'] },

  // 7. Specialist vs Generalist - 3 Variations
  { id: 219, section: 'work_style_preferences', category: 'clarifier', text: 'Would you rather be: Excellent at one highly specific skill (1) OR Good at five different but related skills (5)?', dimensions: [{ dimension: 'riasec_enterprising', weight: 3 }, { dimension: 'riasec_investigative', weight: -3 }], reverse_scored: false, active: true, tags: ['generalist', 'specialist'], discriminatesBetween: ['riasec_investigative', 'riasec_enterprising'] },
  { id: 220, section: 'work_style_preferences', category: 'clarifier', text: 'I prefer being: The "Go-To Expert" that everyone calls for one specific problem (1) OR The "Jack of All Trades" who can jump into any project (5)?', dimensions: [{ dimension: 'riasec_enterprising', weight: 3 }, { dimension: 'riasec_investigative', weight: -3 }], reverse_scored: false, active: true, tags: ['generalist', 'specialist'], discriminatesBetween: ['riasec_investigative', 'riasec_enterprising'] },
  { id: 221, section: 'work_style_preferences', category: 'clarifier', text: 'Which sounds more boring: Having to do a different task every day (1) OR Having to do the same highly complex task for 10 years (5)?', dimensions: [{ dimension: 'riasec_investigative', weight: 3 }, { dimension: 'riasec_enterprising', weight: -3 }], reverse_scored: false, active: true, tags: ['specialist', 'generalist'], discriminatesBetween: ['riasec_investigative', 'riasec_enterprising'] },

  // 8. Investigative vs Social - 3 Variations
  { id: 222, section: 'cognitive_style', category: 'clarifier', text: 'Which is a better use of time: Doing quiet research to find the truth (1) OR Talking to people to understand their perspectives (5)?', dimensions: [{ dimension: 'riasec_social', weight: 4 }, { dimension: 'riasec_investigative', weight: -4 }], reverse_scored: false, active: true, tags: ['social', 'investigative'], discriminatesBetween: ['riasec_investigative', 'riasec_social'] },
  { id: 223, section: 'cognitive_style', category: 'clarifier', text: 'Would you rather: Spend your morning in a library or lab (1) OR Spend your morning in a group counseling session (5)?', dimensions: [{ dimension: 'riasec_social', weight: 4 }, { dimension: 'riasec_investigative', weight: -4 }], reverse_scored: false, active: true, tags: ['social', 'investigative'], discriminatesBetween: ['riasec_investigative', 'riasec_social'] },
  { id: 224, section: 'cognitive_style', category: 'clarifier', text: 'I find it more fulfilling to: Solve a difficult intellectual puzzle (1) OR Solve a difficult human conflict (5)?', dimensions: [{ dimension: 'riasec_social', weight: 4 }, { dimension: 'riasec_investigative', weight: -4 }], reverse_scored: false, active: true, tags: ['social', 'investigative'], discriminatesBetween: ['riasec_investigative', 'riasec_social'] }
];

export const questions: Question[] = [...coreQuestions, ...branchQuestions, ...clarifierQuestions];

export const sections = [
  { id: 1, name: 'Interest Exploration', key: 'interest_exploration', questions: 30 },
  { id: 2, name: 'Personality Traits', key: 'personality_traits', questions: 12 },
  { id: 3, name: 'Strength Identification', key: 'strength_identification', questions: 12 },
  { id: 4, name: 'Work Style Preferences', key: 'work_style_preferences', questions: 15 },
  { id: 5, name: 'Motivation Drivers', key: 'motivation_drivers', questions: 9 },
  { id: 6, name: 'Cognitive Style', key: 'cognitive_style', questions: 12 },
];

export const getQuestionById = (id: number): Question | undefined => {
  return questions.find(q => q.id === id);
};

export const getQuestionsByCategory = (category: Question['category']): Question[] => {
  return questions.filter(q => q.category === category && q.active);
};

export const getQuestionsByTag = (tag: string): Question[] => {
  return questions.filter(q => q.tags.includes(tag) && q.active);
};
