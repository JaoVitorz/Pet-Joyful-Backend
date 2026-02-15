// Types for Academic Feature
export interface Subject {
  id: string
  name: string
  professor: string
  credits: number
  grade: number
  status: 'approved' | 'failed' | 'pending'
}

export interface StudentAcademicInfo {
  id: string
  name: string
  enrollment: string
  course: string
  semester: number
  gpa: number
  totalCredits: number
}
