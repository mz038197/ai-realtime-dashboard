export interface Student {
  id: string;
  name: string;
  score: number;
  rank?: number;
}

export enum SortOrder {
  DESC = 'DESC',
  ASC = 'ASC',
}

export interface Stats {
  average: number;
  highest: number;
  lowest: number;
  total: number;
}
