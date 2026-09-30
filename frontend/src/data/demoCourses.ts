export interface DemoCourse {
  slug: string
  title: string
  track: string
  summary: string
  overview: string[]
  audience: string
  outcomes: string[]
  lessons: string[]
  duration: string
  format: string
  price: number
}

export const demoCourses: DemoCourse[] = [
  {
    slug: 'ai-for-hr',
    title: 'AI for HR & Modern Work',
    track: 'Curriculum · Applied practice',
    summary:
      'Use AI responsibly to improve research, drafting, talent processes, analysis and decision support while keeping human judgement in charge.',
    overview: [
      'HR teams are already using AI for job descriptions, screening notes, policy drafts and people analytics. This course shows how to do that work without handing over professional judgement.',
      'You will practise real HR workflows: research, writing, talent processes and decision support. Each module ends with a workplace output you can use in your own organisation.',
      'The standard throughout is responsible use. You learn what to automate, what to check, and where a people decision must stay with a human.',
    ],
    audience:
      'HR assistants, officers, business partners and people leaders who want a practical AI toolkit for everyday HR work.',
    outcomes: [
      'Set responsible-use rules for AI in HR work',
      'Speed up research and drafting without losing accuracy',
      'Support talent processes while protecting fairness',
      'Use AI as decision support, not a substitute for judgement',
    ],
    lessons: [
      'Responsible AI principles for HR',
      'Research and drafting workflows',
      'Talent process support',
      'Decision support without outsourcing judgement',
    ],
    duration: '4 weeks',
    format: 'Self-paced lessons with workplace exercises',
    price: 420,
  },
  {
    slug: 'emotional-intelligence',
    title: 'Emotional Intelligence at Work',
    track: 'Curriculum · Human capability',
    summary:
      'Build self-awareness, empathy, emotional regulation and relationship management for difficult workplace situations.',
    overview: [
      'Emotional intelligence is one of the six pillars of the NextGen curriculum. It is the skill that makes feedback, conflict, stakeholder trust and leadership conversations possible.',
      'The course works through self-awareness, self-regulation, social awareness and relationship management using workplace cases rather than abstract theory.',
      'You leave with language and habits for high-pressure moments: a tense one-to-one, a resistant manager, or a team under strain.',
    ],
    audience:
      'Professionals and new managers who need to stay effective, fair and trusted when workplace emotions run high.',
    outcomes: [
      'Notice your own reactions before they drive the conversation',
      'Read interpersonal dynamics across a team',
      'Regulate responses in conflict and feedback',
      'Build trust with colleagues who work differently from you',
    ],
    lessons: [
      'Self-awareness and emotional patterns',
      'Regulating responses under pressure',
      'Empathy and social awareness',
      'Relationship management in difficult conversations',
    ],
    duration: '5 weeks',
    format: 'Cases, reflection and guided practice',
    price: 480,
  },
  {
    slug: 'leadership-development',
    title: 'Leadership Development',
    track: 'Curriculum · People leadership',
    summary:
      'Strengthen delegation, influence, accountability, coaching conversations, team motivation and performance leadership.',
    overview: [
      'This course is for the shift from doing the work yourself to leading other people through it. It follows the manager pathway: peer to manager, then accountability, feedback and trust.',
      'Sessions cover delegation, performance conversations, coaching, conflict and the conditions that let a team perform without constant supervision.',
      'Practice is built around conversations you will actually have: setting expectations, giving feedback, and holding the line with care.',
    ],
    audience:
      'Newly promoted team leads, supervisors and managers moving from individual contribution into people leadership.',
    outcomes: [
      'Make a clean transition from peer to manager',
      'Delegate work and keep accountability clear',
      'Hold feedback, coaching and conflict conversations',
      'Build a high-trust, high-performance team',
    ],
    lessons: [
      'Transitioning from peer to manager',
      'Delegation, accountability and performance conversations',
      'Feedback, coaching and conflict management',
      'Adaptability and decision-making under pressure',
      'Building a high-trust team',
    ],
    duration: '8 weeks',
    format: 'Workshops, practice conversations and a team action plan',
    price: 720,
  },
  {
    slug: 'core-hr-capability',
    title: 'Core HR Capability',
    track: 'Curriculum · HR practice',
    summary:
      'Develop stronger practice across talent, performance, employee relations, rewards, organisational development and people strategy.',
    overview: [
      'Core HR capability is the technical spine of the lab. It is for practitioners who can describe HR activity but need firmer judgement across the employee lifecycle.',
      'You work through talent and workforce planning, performance and rewards, employee relations, organisational development, and how those practices connect to people strategy.',
      'The aim is credibility: clearer standards, better advice to managers, and HR work that holds up when the business asks why.',
    ],
    audience:
      'HR assistants, officers, specialists and generalists building a pathway from delivery into strategic people work.',
    outcomes: [
      'Apply sound judgement across core HR processes',
      'Advise managers on talent, performance and relations issues',
      'Connect HR routines to organisational capability',
      'Position your own career against a capability roadmap',
    ],
    lessons: [
      'HR foundations and professional judgement',
      'Talent, performance and rewards practice',
      'Employee relations judgement',
      'Organisational development',
      'Career positioning and capability roadmap',
    ],
    duration: '8 weeks',
    format: 'Applied modules with manager-ready tools',
    price: 640,
  },
  {
    slug: 'next-gen-soft-skills',
    title: 'Next Gen Soft Skills',
    track: 'Curriculum · Future of work',
    summary:
      'Build communication, critical thinking, creativity, adaptability, collaboration and resilience as durable capabilities for modern work.',
    overview: [
      'Eight human capabilities sit at the centre of the NextGen soft-skills spine: emotional intelligence, creativity, business communication, leadership, adaptability, collaboration, critical thinking and resilience.',
      'This course treats them as professional skills, not personality traits. Each module uses exercises, cases and a workplace application so the skill shows up in meetings, writing and decisions.',
      'You finish with a personal capability plan: which skills to practise, where they matter in your role, and how you will know they have improved.',
    ],
    audience:
      'Individual contributors and leaders who want communication, judgement and adaptability that hold up as work changes.',
    outcomes: [
      'Communicate with structure and executive relevance',
      'Think critically about evidence, not assumptions',
      'Collaborate across functions when priorities clash',
      'Stay effective through change, pressure and uncertainty',
    ],
    lessons: [
      'Business communication and executive presence',
      'Analytical and critical thinking',
      'Creativity, adaptability and collaboration',
      'Resilience and sustainable performance',
    ],
    duration: '6 weeks',
    format: 'Exercises, cases, simulations and workplace application',
    price: 560,
  },
  {
    slug: 'strategic-hr-leadership',
    title: 'Strategic HR Leadership',
    track: 'Curriculum · Enterprise impact',
    summary:
      'Connect people decisions to business outcomes through metrics, commercial awareness, stakeholder influence and long-term capability.',
    overview: [
      'Strategic capacity building is for HR managers and heads of HR who are ready to move from delivering HR activity to shaping enterprise people strategy.',
      'The course covers executive communication, people analytics, culture and change, workforce thinking, and AI-enabled HR leadership. The thread through all of it is business impact.',
      'You will produce evidence-based recommendations a leadership team can use: what the people data is saying, what to do next, and how to influence the room.',
    ],
    audience:
      'HR managers, heads of HR and senior people leaders responsible for organisational impact, not only HR delivery.',
    outcomes: [
      'Shift from HR delivery to enterprise people strategy',
      'Influence executives and cross-functional stakeholders',
      'Use people metrics as business evidence',
      'Lead culture, change and workforce decisions with AI in the picture',
    ],
    lessons: [
      'From HR delivery to enterprise people strategy',
      'Executive communication and stakeholder influence',
      'People analytics and evidence-based decisions',
      'Leading culture, change and capability',
      'Strategic workforce thinking and AI-enabled HR',
    ],
    duration: '10 weeks',
    format: 'Strategic labs, cases and a leadership brief',
    price: 890,
  },
]

export function findDemoCourse(slug: string | undefined): DemoCourse | undefined {
  return demoCourses.find((course) => course.slug === slug)
}

export function formatCoursePrice(price: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(price)
}
