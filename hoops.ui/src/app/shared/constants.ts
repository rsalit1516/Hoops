// import { env } from 'process';
import { environment } from '../../environments/environment';
export class Constants {
  public static ALLTEAMS = 'All Teams';

  /* literals */
  public static GAMESMENU = 'Games';
  public static PHOTOMENU = 'Photos';
  public static CONTACTSMENU = 'Contacts';
  public static CLUBDOCSMENU = 'Club Docs';
  public static ADMINMENU = 'Admin';

  // standard divisions
  public static TR2COED = 'Trainee 2 Coed';
  public static TR4 = 'Trainee 4 Boys';
  public static SIBOYS = 'SI Boys';
  public static INTGIRLS = 'Int Girls';
  public static JVGIRLS = 'JV Girls';
  public static SJVBOYS = 'SJV Boys';
  public static HSGIRLS = 'HS Girls';
  public static HSBOYS = 'HS Boys';
  public static MEN = 'Men 18+';
  public static WOMEN = 'Women';

  /* company */
  public static COMPANYID = 1;

  /* urls */
  public static DEFAULTURL = environment.apiUrl;

  public static readonly BASE_URL =
    environment.apiUrl || 'https://localhost:5001';
  public static readonly FUNCTIONS_BASE_URL =
    (environment as any).functionsUrl || this.BASE_URL;
  public static getActiveWebContentUrl = `${this.FUNCTIONS_BASE_URL}/api/webcontent/getActiveWebContent`;
  public static loginUrl = `${this.FUNCTIONS_BASE_URL}/api/auth/login`;
  public static legacyUserLoginUrl = `${this.FUNCTIONS_BASE_URL}/api/user/login`;
  public static GET_DIRECTOR_URL = `${this.FUNCTIONS_BASE_URL}/api/Director`;
  public static SEASON_GAMES_URL = `${this.FUNCTIONS_BASE_URL}/api/ScheduleGame/GetSeasonGames`;
  public static PUT_SEASON_GAME_URL = `${this.FUNCTIONS_BASE_URL}/api/ScheduleGame/`;
  public static PUT_SEASON_GAME_SCORES_URL = `${this.FUNCTIONS_BASE_URL}/api/ScheduleGame/`; // use /{id}/scores
  public static POST_SEASON_GAME_URL = `${this.FUNCTIONS_BASE_URL}/api/ScheduleGame`;

  public static SEASON_DIVISIONS_URL = `${this.FUNCTIONS_BASE_URL}/api/Division/GetSeasonDivisions/`;
  public static DIVISION_URL = `${this.FUNCTIONS_BASE_URL}/api/Division`;
  public static PLAYOFF_GAMES_URL = `${this.FUNCTIONS_BASE_URL}/api/SchedulePlayoff/GetSeasonPlayoffGames`;
  public static getCurrentSeasonUrl = `${this.FUNCTIONS_BASE_URL}/api/season/getCurrentSeason/${this.COMPANYID}`;
  public static GET_SEASON_TEAMS_URL = `${this.FUNCTIONS_BASE_URL}/api/Team/GetSeasonTeams/`;
  public static getColorUrl = `${this.FUNCTIONS_BASE_URL}/api/color`;
  public static GET_LOCATION_URL = `${this.FUNCTIONS_BASE_URL}/api/location`;
  public static teamPostUrl = `${this.FUNCTIONS_BASE_URL}/api/Team`;
  public static teamPutUrl = `${this.FUNCTIONS_BASE_URL}/api/Team/`;
  public static getContentUrl = `${this.BASE_URL}/api/webcontent`;
  public static getActiveContentUrl = `${this.FUNCTIONS_BASE_URL}/api/webcontent/getActiveWebContent`;
  public static postContentUrl = `${this.BASE_URL}/api/WebContent`;
  public static PUT_CONTENT_URL = `${this.BASE_URL}/api/WebContent/`;
  public static GET_CONTENT_TYPES_URL = `${this.FUNCTIONS_BASE_URL}/api/WebContentType/`;
  public static GET_SEASON_SPONSORS = `${this.FUNCTIONS_BASE_URL}/api/Sponsor/GetSeasonSponsors`;
  public static GET_LOCATIONS = `${this.FUNCTIONS_BASE_URL}/api/location`;
  public static SEASON_URL = `${this.FUNCTIONS_BASE_URL}/api/Season/`;
  public static currentSeasonUrl = `${this.FUNCTIONS_BASE_URL}/api/Season/GetCurrentSeason/${this.COMPANYID}`;
  public static peopleUrl = `${this.FUNCTIONS_BASE_URL}/api/Person`;
  public static GET_ADS_URL = `${this.FUNCTIONS_BASE_URL}/api/Person/GetADs`;
  public static GET_STANDINGS_URL = `${this.FUNCTIONS_BASE_URL}/api/ScheduleGame/GetStandings`;
  public static SEARCH_HOUSEHOLD_URL = `${this.FUNCTIONS_BASE_URL}/api/Household/search`;
  public static GET_HOUSEHOLD_MEMBERS_URL = `${this.FUNCTIONS_BASE_URL}/api/Person/GetHouseholdMembers`;
  public static GET_HOUSEHOLD_BY_ID_URL = `${this.FUNCTIONS_BASE_URL}/api/Household`;
  public static SEARCH_PEOPLE_URL = `${this.FUNCTIONS_BASE_URL}/api/Person/search`;
  public static SAVE_HOUSEHOLD_URL = `${this.FUNCTIONS_BASE_URL}/api/Household/`;
}
export const Literals = {
  BUTTONS: {
    SUBMIT: 'Submit',
    CANCEL: 'Cancel',
  },
  MESSAGES: {
    WELCOME: 'Welcome to the application!',
    ERROR: 'Something went wrong. Please try again.',
  },
  LABELS: {
    USERNAME: 'Username',
    PASSWORD: 'Password',
    SEASON_GAMES: 'Season Games',
  },
};

export const FEATURE_FLAGS = {
  adminHouseholds: true, // Enabled feature
  adminNotices: true, // Disabled feature
  adminPeople: true,
  adminDirectors: false,
  adminColors: false,
  adminUsers: false,
  adminGames: true,
};
export class FormSettings {
  public static inputStyle: 'fill' | 'outline' = 'fill';
}
