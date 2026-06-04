export type AwardType = 'HND' | 'BTech';

export type HtuDepartment = {
  name: string;
  programmes: Partial<Record<AwardType, string[]>>;
};

export type HtuFaculty = {
  name: string;
  departments: HtuDepartment[];
};

export const YEAR_GROUPS = [
  'Level 100',
  'Level 200',
  'Level 300',
  'Level 400',
] as const;

export const AWARD_TYPES: AwardType[] = ['HND', 'BTech'];

export const HTU_FACULTIES: HtuFaculty[] = [
  {
    name: 'Faculty of Applied Sciences and Technology',
    departments: [
      {
        name: 'Computer Science',
        programmes: {
          HND: ['Computer Science', 'Information and Communication Technology'],
          BTech: ['Information Technology'],
        },
      },
      {
        name: 'Information Technology',
        programmes: {
          HND: ['Information Technology'],
          BTech: ['Information Technology'],
        },
      },
      {
        name: 'Agricultural Sciences and Technology',
        programmes: {
          HND: ['Agricultural Extension'],
          BTech: ['Agricultural Engineering'],
        },
      },
      {
        name: 'Food Science and Technology',
        programmes: {
          HND: ['Agro-Enterprise Development'],
          BTech: ['Food Science and Technology'],
        },
      },
      {
        name: 'Hospitality and Tourism Management',
        programmes: {
          HND: ['Hotel, Catering and Institutional Management'],
          BTech: ['Hospitality Management and Catering Technology'],
        },
      },
      {
        name: 'Mathematics and Statistics',
        programmes: {
          HND: ['Statistics'],
          BTech: ['Statistics'],
        },
      },
    ],
  },
  {
    name: 'Faculty of Engineering',
    departments: [
      {
        name: 'Agricultural Engineering',
        programmes: {
          HND: ['Agricultural Engineering'],
          BTech: ['Agricultural Engineering'],
        },
      },
      {
        name: 'Civil Engineering',
        programmes: {
          HND: ['Civil Engineering'],
          BTech: ['Civil Engineering'],
        },
      },
      {
        name: 'Electrical/Electronic Engineering',
        programmes: {
          HND: ['Electrical/Electronic Engineering'],
          BTech: ['Electrical/Electronic Engineering'],
        },
      },
      {
        name: 'Mechanical Engineering',
        programmes: {
          HND: ['Mechanical Engineering'],
          BTech: ['Automobile Engineering', 'Mechanical Engineering'],
        },
      },
    ],
  },
  {
    name: 'Faculty of Built and Natural Environment',
    departments: [
      {
        name: 'Architectural and Real Estate Management',
        programmes: {
          HND: ['Estate Management'],
          BTech: ['Real Estate Management'],
        },
      },
      {
        name: 'Building Technology',
        programmes: {
          HND: ['Building Technology'],
          BTech: ['Construction Technology and Management'],
        },
      },
      {
        name: 'Environmental Science',
        programmes: {
          HND: ['Environmental Management'],
          BTech: ['Environmental Science and Technology'],
        },
      },
    ],
  },
  {
    name: 'HTU Business School',
    departments: [
      {
        name: 'Accounting and Finance',
        programmes: {
          HND: ['Accountancy'],
          BTech: ['Accounting Technology'],
        },
      },
      {
        name: 'Logistics and Supply Chain Management',
        programmes: {
          HND: ['Purchasing and Supply'],
          BTech: ['Procurement and Supply Chain Management'],
        },
      },
      {
        name: 'Management Sciences',
        programmes: {
          HND: ['Secretaryship and Management Studies'],
          BTech: ['Secretaryship and Management Studies'],
        },
      },
      {
        name: 'Marketing',
        programmes: {
          HND: ['Marketing'],
          BTech: ['Marketing'],
        },
      },
    ],
  },
  {
    name: 'Faculty of Art and Design',
    departments: [
      {
        name: 'Fashion Design and Textiles',
        programmes: {
          HND: ['Fashion Design and Textiles'],
          BTech: ['Fashion Design and Textiles'],
        },
      },
      {
        name: 'Industrial Art',
        programmes: {
          HND: ['Industrial Art'],
          BTech: ['Industrial Art'],
        },
      },
    ],
  },
  {
    name: 'Faculty of Applied Social Sciences',
    departments: [
      {
        name: 'Applied Modern Languages and Communication',
        programmes: {
          HND: ['Bilingual Secretaryship and Management Studies'],
          BTech: ['Applied Modern Languages and Communication'],
        },
      },
      {
        name: 'Multidisciplinary Studies',
        programmes: {
          HND: ['Liberal Studies'],
          BTech: ['Social Science'],
        },
      },
    ],
  },
];

export function getDepartments(facultyName: string) {
  return (
    HTU_FACULTIES.find((faculty) => faculty.name === facultyName)?.departments ??
    []
  );
}

export function getProgrammes(
  facultyName: string,
  departmentName: string,
  awardType: AwardType,
) {
  return (
    getDepartments(facultyName).find(
      (department) => department.name === departmentName,
    )?.programmes[awardType] ?? []
  );
}
