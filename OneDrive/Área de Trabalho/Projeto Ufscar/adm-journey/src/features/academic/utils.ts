// Academic Utilities
export function calculateAverage(grades: number[]): number {
  if (grades.length === 0) return 0;
  const sum = grades.reduce((acc, grade) => acc + grade, 0);
  return parseFloat((sum / grades.length).toFixed(2));
}

export function getGradeStatus(grade: number): 'approved' | 'failed' | 'pending' {
  if (grade >= 7) return 'approved';
  if (grade < 5) return 'failed';
  return 'pending';
}
