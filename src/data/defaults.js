// Default website content, as plain JSON-safe data.
// The admin panel edits a copy of this (grouped by area) and saves it to the
// database; anything not yet edited there falls back to what is written here.
// Icons are stored by name and turned into components in ./icons.js.

export const defaults = {
  announcement: {
    enabled: false,
    text: '',
    linkLabel: '',
    linkUrl: '',
  },

  school: {
    name: 'SATTVA International School',
    shortName: 'SATTVA',
    tagline: 'Rooted in values. Ready for tomorrow.',
    board: 'GSEB',
    boardFull: 'Gujarat Secondary and Higher Secondary Education Board',
    founded: '2022',
    mediums: ['English', 'Gujarati'],
    studentTeacherRatio: '15:1',
    address: {
      lines: ['Opposite Swapnil Homes, Near A.M. Patel Farm', 'Satyam Bunglow Char Rasta, Singarwa'],
      city: 'Ahmedabad',
      state: 'Gujarat',
      pin: '382430',
    },
    phones: [
      { label: 'Mobile', display: '+91 97144 81717', tel: '+919714481717' },
      { label: 'Landline', display: '079 4714 7985', tel: '+917947147985' },
    ],
    emails: [
      { label: 'General', address: 'info@sattvainternationalschool.com' },
      { label: 'Admissions', address: 'admissions@sattvainternationalschool.com' },
    ],
    hours: [
      { days: 'Monday – Friday', time: '8:00 AM – 6:00 PM' },
      { days: 'Saturday', time: '8:00 AM – 5:00 PM' },
      { days: 'Sunday', time: 'Closed' },
    ],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sattva+International+School+Singarwa+Ahmedabad',
    mapEmbed: 'https://www.google.com/maps?q=Sattva+International+School+Singarwa+Ahmedabad&output=embed',
    transportAreas: ['Singarwa', 'Bhuvaladi', 'Odhav', 'Vastral', 'Nikol'],
    social: [],
  },

  home: {
    eyebrow: 'GSEB school · Singarwa, Ahmedabad',
    titleLine1: 'Rooted in values.',
    titleLine2: 'Ready for tomorrow.',
    lead: 'GSEB education from JrKG to Std 12 in English and Gujarati medium, with Science and Commerce streams — on a modern campus in Singarwa.',
    heroImage: { src: '/photos/campus-front.jpg', thumb: '/photos/campus-front-800.jpg', alt: 'The SATTVA International School building in Singarwa, Ahmedabad' },
    campusImage: { src: '/photos/campus-garden.jpg', thumb: '/photos/campus-garden-800.jpg', alt: 'The SATTVA campus with its green wall, classrooms and playground' },
    facts: [
      { value: 'GSEB', label: 'Affiliated board' },
      { value: 'JrKG – 12', label: 'All standards, one campus' },
      { value: '2 mediums', label: 'English & Gujarati' },
      { value: '2 streams', label: 'Science & Commerce' },
      { value: '15:1', label: 'Student–teacher ratio' },
    ],
    whyChoose: [
      { title: 'GSEB curriculum', text: 'A recognised state-board education from JrKG to Std 12, all on one campus.' },
      { title: 'English & Gujarati medium', text: 'Families choose the medium of instruction that suits their child best.' },
      { title: 'Fully air-conditioned classrooms', text: 'Comfortable classrooms keep children focused through the Ahmedabad summer.' },
      { title: 'Personal attention', text: 'A 15:1 student–teacher ratio means every child is known and supported.' },
      { title: 'Science labs & computer lab', text: 'Dedicated physics, chemistry and biology labs, and a well-equipped computer lab.' },
      { title: 'Safe school transport', text: 'GPS-enabled buses across Singarwa, Bhuvaladi, Odhav, Vastral and Nikol.' },
    ],
  },

  about: {
    story: [
      'In Sanskrit, sattva means purity, goodness and balance — qualities we try to nurture in every child who walks through our gates.',
      'We believe a good school does more than prepare children for examinations. It helps them become confident, kind and curious people. That is why our students spend their days in comfortable, air-conditioned classrooms and well-equipped labs, but also on stage, in karate and skating sessions, in the art room and celebrating festivals together.',
      'Today we teach every standard from JrKG to Std 12 under the GSEB, in both English and Gujarati medium, with Science and Commerce streams in Std 11 and 12.',
    ],
    mission: 'To provide a caring, stimulating environment where every student can reach their potential, develop strong moral character and grow into a responsible citizen.',
    vision: 'To be a school families trust — known for good teaching, strong values, safety, and a lifelong love of learning in every child.',
    values: [
      { title: 'Excellence', text: 'Aiming high in everything we do.', icon: 'Target', tone: 'red' },
      { title: 'Compassion', text: 'A caring, inclusive school family.', icon: 'Heart', tone: 'green' },
      { title: 'Integrity', text: 'Honesty and strong moral character.', icon: 'Shield', tone: 'purple' },
      { title: 'Curiosity', text: 'Asking questions and loving to learn.', icon: 'Lightbulb', tone: 'blue' },
    ],
    milestones: [
      { year: '2022', title: 'SATTVA is founded', text: 'The school opens in Singarwa, Ahmedabad, blending value-based learning with modern education.' },
      { year: '2023', title: 'GSEB affiliation', text: 'Affiliated with GSEB, offering both English and Gujarati medium.' },
      { year: '2024', title: 'Campus expansion', text: 'Physics, chemistry and biology labs, two auditoriums and fully air-conditioned classrooms.' },
    ],
  },

  academics: {
    stages: [
      {
        name: 'Pre-Primary',
        standards: ['JrKG', 'SrKG'],
        icon: 'Backpack',
        tone: 'red',
        summary: 'Play-based learning that builds curiosity, language and motor skills.',
        details: [
          'Learning through play, stories, rhymes and hands-on activities',
          'Early language, number sense and fine-motor development',
          'Gentle routines that help children feel happy and settled at school',
        ],
      },
      {
        name: 'Primary',
        standards: ['Balvatika', 'Std 1 – 8'],
        icon: 'BookOpen',
        tone: 'green',
        summary: 'Strong foundations in reading, writing, mathematics and thinking.',
        details: [
          'GSEB curriculum from Balvatika through Std 8',
          'Reading, writing, mathematics, science and social studies',
          'Computer education, arts, dance, yoga and physical training alongside academics',
        ],
      },
      {
        name: 'Secondary',
        standards: ['Std 9', 'Std 10'],
        icon: 'FlaskConical',
        tone: 'purple',
        summary: 'Focused preparation for the Std 10 GSEB board examination.',
        details: [
          'Complete GSEB syllabus in English and Gujarati medium',
          'Practical work in our physics, chemistry and biology labs',
          'Focused preparation for the Std 10 board examination',
        ],
      },
      {
        name: 'Higher Secondary',
        standards: ['Std 11', 'Std 12'],
        icon: 'GraduationCap',
        tone: 'blue',
        summary: 'Science and Commerce streams leading to the Std 12 board examination.',
        details: [
          'Science: Physics, Chemistry, Mathematics and Biology',
          'Commerce: Accountancy, Economics, Statistics and Organisation of Commerce & Management',
          'Preparation for the Std 12 GSEB board examination',
        ],
      },
    ],
    streams: [
      {
        name: 'Science',
        icon: 'FlaskConical',
        tone: 'purple',
        subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
        text: 'Theory and regular practicals in our dedicated physics, chemistry and biology labs.',
      },
      {
        name: 'Commerce',
        icon: 'BarChart3',
        tone: 'orange',
        subjects: ['Accountancy', 'Economics', 'Statistics', 'Organisation of Commerce & Management'],
        text: 'A strong grounding in business, finance and economics.',
      },
    ],
    computerTopics: ['Computer fundamentals', 'History of computers', 'MS Word', 'MS Excel', 'Paint', 'HTML & CSS basics'],
  },

  campus: {
    facilities: [
      { title: 'Science Laboratories', text: 'Separate physics, chemistry and biology labs for hands-on experiments.', icon: 'Microscope' },
      { title: 'Computer Lab', text: 'Computer basics, Word, Excel, Paint and HTML/CSS, as per the GSEB curriculum.', icon: 'Laptop' },
      { title: 'Two Auditoriums', text: 'Home to our annual function, cultural programmes and assemblies.', icon: 'Presentation' },
      { title: 'Air-Conditioned Classrooms', text: 'Every classroom is fully air-conditioned.', icon: 'Snowflake' },
      { title: 'GPS-Enabled Transport', text: 'School buses covering Singarwa and nearby areas of Ahmedabad.', icon: 'Bus' },
    ],
    activities: [
      { title: 'Drawing & Arts', text: 'Sketching, painting and craft to build creativity.', icon: 'Palette', tone: 'red' },
      { title: 'Dance', text: 'Rhythm, expression and confidence, showcased at our annual function.', icon: 'Music2', tone: 'tan' },
      { title: 'Karate', text: 'Discipline, confidence and self-defence.', icon: 'Swords', tone: 'green' },
      { title: 'Physical Training', text: 'Regular PT sessions for fitness and teamwork.', icon: 'Dumbbell', tone: 'purple' },
      { title: 'Skating', text: 'Balance, coordination and plenty of fun.', icon: 'Activity', tone: 'crimson' },
      { title: 'Yoga & Meditation', text: 'Calm minds and healthy bodies.', icon: 'Flower2', tone: 'olive' },
      { title: 'Computer', text: 'Practical computer skills from the early standards.', icon: 'Monitor', tone: 'blue' },
    ],
    annualFunction: ['Dance performances', 'Karate demonstrations', 'Anchoring & hosting', 'Commentary'],
    festivals: ['Uttarayan', 'Holi', 'Raksha Bandhan', 'Janmashtami', 'Navratri', 'Diwali'],
    houses: { named: ['Glory', 'Prestige'], total: 4 },
  },

  admissions: {
    open: false,
    academicYear: '',
    steps: [
      { title: 'Enquire', text: 'Fill in the enquiry form on this page or call us on +91 97144 81717.' },
      { title: 'Visit the campus', text: 'Tour the school, see the classrooms and labs, and meet our team.' },
      { title: 'Submit the form', text: 'Complete the admission form and hand in the required documents at the office.' },
      { title: 'Confirmation', text: 'The admissions office confirms your child’s seat and shares the joining details.' },
    ],
    documents: [
      'Birth certificate of the student',
      'Aadhaar card of the student',
      'School Leaving Certificate (for Std 1 and above)',
      'Previous year’s result / marksheet',
      'Passport-size photographs of the student',
      'Aadhaar card of a parent or guardian',
    ],
    faqs: [
      { q: 'Which standards do you offer?', a: 'We teach JrKG, SrKG, Balvatika and Std 1 to Std 12, with Science and Commerce streams in Std 11 and 12.' },
      { q: 'Which board is the school affiliated with?', a: 'SATTVA International School follows the GSEB (Gujarat Secondary and Higher Secondary Education Board) curriculum.' },
      { q: 'Is the school English medium or Gujarati medium?', a: 'Both. Every standard is offered in English medium and Gujarati medium.' },
      { q: 'What are the age criteria for admission?', a: 'Admissions follow Gujarat Government age guidelines — for example, a child must be 6 years old by 1 June to join Std 1. Please contact the admissions office for the criteria for JrKG, SrKG and Balvatika.' },
      { q: 'Do you provide school transport?', a: 'Yes. Our GPS-enabled buses cover Singarwa, Bhuvaladi, Odhav, Vastral, Nikol and nearby areas of Ahmedabad.' },
      { q: 'Can we visit the school before applying?', a: 'Of course. Campus visits can be arranged during office hours — call +91 97144 81717 to book a time.' },
    ],
  },

  // Real SATTVA photos live in /public/photos. `placeholder: true` marks stock
  // images still waiting to be replaced with school photos.
  gallery: {
    photos: [
      { src: '/photos/campus-front.jpg', thumb: '/photos/campus-front-800.jpg', alt: 'SATTVA International School main building', category: 'Campus' },
      { src: '/photos/campus-garden.jpg', thumb: '/photos/campus-garden-800.jpg', alt: 'School building with the green wall and playground', category: 'Campus' },
      ...[
        ['photo-1577896851231-70ef18881754', 'Students on stage', 'Events'],
        ['photo-1564069114553-7215e1ff1890', 'Science activity', 'Academics'],
        ['photo-1580582932707-520aed937b7b', 'Lab practical', 'Academics'],
        ['photo-1529390079861-591de354faf5', 'Art class', 'Activities'],
        ['photo-1541534741688-6078c6bfb5c5', 'Outdoor games', 'Activities'],
        ['photo-1509062522246-3755977927d7', 'Teacher helping a student', 'Academics'],
        ['photo-1542744095-fcf48d80b0fd', 'School celebration', 'Events'],
      ].map(([id, alt, category]) => ({
        src: `https://images.unsplash.com/${id}?auto=format&fit=crop&q=75&w=900`,
        thumb: `https://images.unsplash.com/${id}?auto=format&fit=crop&q=70&w=500`,
        alt,
        category,
        placeholder: true,
      })),
    ],
  },

  quotes: {
    home: { text: 'Dream is not that which you see while sleeping, it is something that does not let you sleep.', by: 'Dr. A. P. J. Abdul Kalam' },
    about: { text: 'Education is the manifestation of the perfection already in man.', by: 'Swami Vivekananda' },
    academics: { text: 'Teachers should be the best minds in the country.', by: 'Dr. Sarvepalli Radhakrishnan' },
    admissions: { text: 'Live as if you were to die tomorrow. Learn as if you were to live forever.', by: 'Mahatma Gandhi' },
    gallery: { text: 'Don’t limit a child to your own learning, for he was born in another time.', by: 'Rabindranath Tagore' },
  },

  // "Children's voices" — the section only appears once real entries exist.
  voices: {
    items: [],
  },

  settings: {
    emailAlerts: true,
  },
};

export const CONTENT_KEYS = Object.keys(defaults);
