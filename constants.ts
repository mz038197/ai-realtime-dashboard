import { Student } from './types';

export const AVATAR_OPTIONS = [
  '🐱', '🐶', '🦊', '🦁', '🐯', 
  '🐨', '🐼', '🐻', '🐰', '🐹',
  '🐷', '🐸', '🐵', '🦄', '🐙',
  '🦉', '🐧', '🐤', '🐝', '🐞'
];

export const getRandomAvatar = () => {
  return AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)];
};

export const SAMPLE_STUDENTS: Student[] = [
  { id: '1', name: 'Alice Johnson', score: 92, avatar: '🦊' },
  { id: '2', name: 'Bob Smith', score: 78, avatar: '🐼' },
  { id: '3', name: 'Charlie Brown', score: 85, avatar: '🐶' },
  { id: '4', name: 'Diana Prince', score: 98, avatar: '🦄' },
  { id: '5', name: 'Evan Wright', score: 64, avatar: '🐸' },
];

export const GEMINI_MODEL_FLASH = 'gemini-2.5-flash';