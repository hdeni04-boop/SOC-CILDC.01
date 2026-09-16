export interface OverstayRecord {
  id: string;
  initials: string;
  name: string;
  badgeId: string;
  gate: string;
  category: string;
  timeOut: string;
  durationSeconds: number;
  overstayText: string;
  supervisor: string;
  extension: string;
}

export interface LiveTimerRecord {
  id: string;
  name: string;
  badgeId: string;
  zone: string;
  sessionType: string;
  timeOut: string;
  durationSeconds: number;
  limitMinutes: number;
  status: 'Aman' | 'Hampir Habis';
}
