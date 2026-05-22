export interface AvailableTimeSlot {
  dayOfWeek: number;
  startTime: string;
  locationId: number | null;
}

export interface ScheduleBlackoutDate {
  date: string;
  locationId: number | null;
}

export interface ScheduleGeneratorRequest {
  seasonId: number;
  startDate: string | null;
  endDate: string | null;
  divisionIds: number[];
  gamesPerTeam: number;
  maxGamesPerWeekPerTeam: number;
  gameDurationMinutes: number;
  timeSlots: AvailableTimeSlot[];
  blackoutDates: ScheduleBlackoutDate[];
  enforceCoachConflicts: boolean;
}

export interface ScheduleGamePreviewItem {
  divisionId: number;
  divisionName: string;
  scheduleNumber: number;
  gameNumber: number;
  gameDate: string;
  gameTime: string;
  locationNumber: number;
  locationName: string;
  homeTeamId: number;
  homeTeamName: string;
  visitingTeamId: number;
  visitingTeamName: string;
  warnings: string[];
}

export interface ScheduleGeneratorResult {
  success: boolean;
  errorMessage: string | null;
  games: ScheduleGamePreviewItem[];
  totalGames: number;
}

export interface ScheduleCommitRequest {
  seasonId: number;
  games: ScheduleGamePreviewItem[];
}

export interface ScheduleCommitResult {
  gamesCreated: number;
  errors: string[];
}
