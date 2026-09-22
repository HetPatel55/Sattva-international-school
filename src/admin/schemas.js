// What the admin panel lets the school edit, area by area. Each field maps to
// the same key in src/data/defaults.js. Field types are rendered by SchemaForm.

const text = (name, label, extra = {}) => ({ name, label, type: 'text', ...extra });
const area = (name, label, extra = {}) => ({ name, label, type: 'textarea', ...extra });
const strings = (name, label, extra = {}) => ({ name, label, type: 'strings', ...extra });
const items = (name, label, fields, extra = {}) => ({ name, label, type: 'items', fields, ...extra });

export const SCHEMAS = {
  announcement: {
    title: 'Announcement strip',
    description: 'A short message shown at the top of every page, e.g. “Admissions open for 2027–28”.',
    fields: [
      { name: 'enabled', label: 'Show the announcement', type: 'toggle' },
      text('text', 'Message', { placeholder: 'Admissions open for 2027–28' }),
      text('linkLabel', 'Button text (optional)', { placeholder: 'Enquire now' }),
      text('linkUrl', 'Button link (optional)', { placeholder: '/admissions#enquiry', help: 'A page on this site starts with /, e.g. /admissions' }),
    ],
  },

  school: {
    title: 'School details',
    description: 'Name, phone numbers, emails, address, office hours, map and transport areas.',
    fields: [
      text('name', 'School name'),
      text('board', 'Board (short)', { placeholder: 'GSEB' }),
      text('boardFull', 'Board (full name)'),
      text('founded', 'Year founded'),
      strings('mediums', 'Mediums of instruction'),
      text('studentTeacherRatio', 'Student–teacher ratio'),
      {
        name: 'address', label: 'Address', type: 'group',
        fields: [strings('lines', 'Address lines'), text('city', 'City'), text('state', 'State'), text('pin', 'PIN code')],
      },
      items('phones', 'Phone numbers', [
        text('label', 'Label', { placeholder: 'Mobile' }),
        text('display', 'Number as shown', { placeholder: '+91 97144 81717' }),
        text('tel', 'Number for tap-to-call', { placeholder: '+919714481717', help: 'Digits only, starting with +91' }),
      ], { itemLabel: 'display' }),
      items('emails', 'Email addresses', [text('label', 'Label'), text('address', 'Email')], { itemLabel: 'address' }),
      items('hours', 'Office hours', [text('days', 'Days', { placeholder: 'Monday – Friday' }), text('time', 'Time', { placeholder: '8:00 AM – 6:00 PM' })], { itemLabel: 'days' }),
      strings('transportAreas', 'School bus areas'),
      text('mapUrl', 'Google Maps link (Get directions)'),
      text('mapEmbed', 'Google Maps embed link (map on Contact page)'),
      items('social', 'Social media links', [text('label', 'Name', { placeholder: 'Instagram' }), text('url', 'Link', { placeholder: 'https://www.instagram.com/…' })], {
        itemLabel: 'label', help: 'Shown in the footer once added.',
      }),
    ],
  },

  home: {
    title: 'Home page',
    description: 'Main heading, text and photos at the top, the key facts strip and “Why SATTVA”.',
    fields: [
      text('eyebrow', 'Small line above the heading'),
      text('titleLine1', 'Heading — first line'),
      text('titleLine2', 'Heading — second line (in colour)'),
      area('lead', 'Text under the heading'),
      { name: 'heroImage', label: 'Main photo', type: 'image', help: 'Shown whole — any shape works.' },
      { name: 'campusImage', label: 'Campus photo (Home & Campus Life)', type: 'image' },
      items('facts', 'Key facts strip', [text('value', 'Big text', { placeholder: 'GSEB' }), text('label', 'Small text', { placeholder: 'Affiliated board' })], { itemLabel: 'value' }),
      items('whyChoose', 'Why SATTVA — reasons', [text('title', 'Title'), area('text', 'Text')], { itemLabel: 'title' }),
    ],
  },

  about: {
    title: 'About page',
    description: 'Our story, mission and vision, values and the year-by-year timeline.',
    fields: [
      strings('story', 'Our story — paragraphs', { multiline: true }),
      area('mission', 'Our mission'),
      area('vision', 'Our vision'),
      items('values', 'Values', [text('title', 'Title'), text('text', 'Text'), { name: 'icon', label: 'Icon', type: 'icon' }, { name: 'tone', label: 'Colour', type: 'tone' }], { itemLabel: 'title' }),
      items('milestones', 'Timeline', [text('year', 'Year'), text('title', 'Title'), area('text', 'Text')], { itemLabel: 'year' }),
    ],
  },

  academics: {
    title: 'Academics',
    description: 'The four stages (JrKG to Std 12), Science & Commerce subjects and computer topics.',
    fields: [
      items('stages', 'Stages', [
        text('name', 'Stage name'),
        strings('standards', 'Standards'),
        { name: 'icon', label: 'Icon', type: 'icon' },
        { name: 'tone', label: 'Colour', type: 'tone' },
        area('summary', 'Short summary'),
        strings('details', 'Points'),
      ], { itemLabel: 'name' }),
      items('streams', 'Std 11 & 12 streams', [
        text('name', 'Stream'),
        { name: 'icon', label: 'Icon', type: 'icon' },
        { name: 'tone', label: 'Colour', type: 'tone' },
        area('text', 'Text'),
        strings('subjects', 'Main subjects'),
      ], { itemLabel: 'name' }),
      strings('computerTopics', 'Computer lab topics'),
    ],
  },

  campus: {
    title: 'Campus life',
    description: 'Facilities, activities, annual function, festivals and house names.',
    fields: [
      items('facilities', 'Facilities', [text('title', 'Title'), text('text', 'Text'), { name: 'icon', label: 'Icon', type: 'icon' }], { itemLabel: 'title' }),
      items('activities', 'Activities', [text('title', 'Title'), text('text', 'Text'), { name: 'icon', label: 'Icon', type: 'icon' }, { name: 'tone', label: 'Colour', type: 'tone' }], { itemLabel: 'title' }),
      strings('annualFunction', 'Annual function — what students perform'),
      strings('festivals', 'Festivals celebrated'),
      {
        name: 'houses', label: 'House system', type: 'group',
        fields: [strings('named', 'House names'), { name: 'total', label: 'Number of houses', type: 'number' }],
      },
    ],
  },

  admissions: {
    title: 'Admissions',
    description: 'Admissions-open badge, the steps, documents list and FAQs.',
    fields: [
      { name: 'open', label: 'Show “Admissions open” badge', type: 'toggle' },
      text('academicYear', 'Academic year', { placeholder: '2027–28' }),
      items('steps', 'Admission steps', [text('title', 'Title'), area('text', 'Text')], { itemLabel: 'title' }),
      strings('documents', 'Documents needed'),
      items('faqs', 'Questions & answers', [text('q', 'Question'), area('a', 'Answer')], { itemLabel: 'q' }),
    ],
  },

  gallery: {
    title: 'Gallery',
    description: 'Add, replace or remove photos. Event albums are added automatically under “Events”.',
    fields: [
      items('photos', 'Photos', [
        { name: '_photo', label: 'Photo', type: 'image', inline: true },
        text('alt', 'Caption'),
        { name: 'category', label: 'Category', type: 'select', options: ['Campus', 'Academics', 'Activities', 'Events'] },
        { name: 'placeholder', label: 'Mark as “Sample photo” (not a real school photo)', type: 'toggle' },
      ], { itemLabel: 'alt', newItem: { category: 'Campus' } }),
    ],
  },

  quotes: {
    title: 'Quotes',
    description: 'The quote shown on each page.',
    fields: ['home', 'about', 'academics', 'admissions', 'gallery'].map((page) => ({
      name: page,
      label: `${page[0].toUpperCase()}${page.slice(1)} page`,
      type: 'group',
      fields: [area('text', 'Quote'), text('by', 'By')],
    })),
  },

  voices: {
    title: 'Children’s voices',
    description: 'Short words from students or parents. The section appears on the Home page once one is added.',
    fields: [
      items('items', 'Voices', [area('quote', 'What they said'), text('name', 'Name'), text('role', 'Who they are', { placeholder: 'Std 8 student' })], { itemLabel: 'name' }),
    ],
  },

  settings: {
    title: 'Settings',
    description: 'Email alerts for new enquiries.',
    fields: [
      { name: 'emailAlerts', label: 'Also email each new enquiry (to the address set up with formsubmit)', type: 'toggle' },
    ],
  },
};

export const AREA_ORDER = ['school', 'home', 'about', 'academics', 'campus', 'admissions', 'gallery', 'voices', 'quotes', 'announcement', 'settings'];
