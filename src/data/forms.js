// Choices offered in the enquiry forms (also used by the admin inbox filters).
export const STANDARDS = [
  'JrKG', 'SrKG', 'Balvatika',
  'Std 1', 'Std 2', 'Std 3', 'Std 4', 'Std 5', 'Std 6', 'Std 7', 'Std 8',
  'Std 9', 'Std 10',
  'Std 11 – Science', 'Std 11 – Commerce',
  'Std 12 – Science', 'Std 12 – Commerce',
];

export const SUBJECTS = ['Admission enquiry', 'Campus visit', 'School transport', 'Fees', 'Other'];

// Aspect ratio for an image that knows its own size, e.g. "1600 / 1131".
export const ratioOf = (image) => (image?.w && image?.h ? `${image.w} / ${image.h}` : undefined);
