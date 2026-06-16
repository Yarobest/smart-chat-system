export type CourseTemplate = {
  code: string;
  name: string;
};

const courseTemplates: Record<string, CourseTemplate[]> = {
  'HND::Computer Science::Level 100': [
    { code: 'CS101', name: 'Introduction to Computer Science' },
    { code: 'CS102', name: 'Computer Programming I' },
    { code: 'CS103', name: 'Computer Hardware Fundamentals' },
    { code: 'MTH101', name: 'Mathematics for Computing' },
    { code: 'COM101', name: 'Communication Skills I' },
  ],
  'HND::Computer Science::Level 200': [
    { code: 'CS201', name: 'Data Structures and Algorithms' },
    { code: 'CS202', name: 'Database Systems' },
    { code: 'CS203', name: 'Systems Analysis and Design' },
    { code: 'CS204', name: 'Computer Networks' },
    { code: 'CS205', name: 'Object Oriented Programming' },
  ],
  'HND::Computer Science::Level 300': [
    { code: 'CS301', name: 'Operating Systems' },
    { code: 'CS302', name: 'Web Application Development' },
    { code: 'CS303', name: 'Software Engineering' },
    { code: 'CS304', name: 'Information Systems Security' },
    { code: 'CS305', name: 'Project Work' },
  ],
  'BTech::Information Technology::Level 100': [
    { code: 'IT101', name: 'Introduction to Information Technology' },
    { code: 'IT102', name: 'Programming Fundamentals' },
    { code: 'IT103', name: 'Digital Systems' },
    { code: 'MTH101', name: 'Discrete Mathematics' },
    { code: 'COM101', name: 'Communication Skills I' },
  ],
  'BTech::Information Technology::Level 200': [
    { code: 'IT201', name: 'Database Management Systems' },
    { code: 'IT202', name: 'Network Fundamentals' },
    { code: 'IT203', name: 'Web Technologies' },
    { code: 'IT204', name: 'Object Oriented Programming' },
    { code: 'IT205', name: 'Human Computer Interaction' },
  ],
  'BTech::Information Technology::Level 300': [
    { code: 'IT301', name: 'Mobile Application Development' },
    { code: 'IT302', name: 'Cloud Computing' },
    { code: 'IT303', name: 'Cyber Security' },
    { code: 'IT304', name: 'Data Analytics' },
    { code: 'IT305', name: 'Research Methods' },
  ],
  'BTech::Information Technology::Level 400': [
    { code: 'IT401', name: 'Artificial Intelligence' },
    { code: 'IT402', name: 'Enterprise Systems' },
    { code: 'IT403', name: 'IT Project Management' },
    { code: 'IT404', name: 'Final Year Project' },
    { code: 'IT405', name: 'Professional Ethics in IT' },
  ],
};

export function getCourseTemplates(
  awardType?: string,
  programme?: string,
  yearGroup?: string,
) {
  if (!awardType || !programme || !yearGroup) {
    return [];
  }

  return courseTemplates[`${awardType}::${programme}::${yearGroup}`] ?? [];
}
