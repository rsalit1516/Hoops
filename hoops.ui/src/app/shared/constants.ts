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

  public static BASE_URL = Constants.DEFAULTURL;
  public static dotNetCoreUrl = environment.apiUrl;
  public static getActiveWebContentUrl = Constants.DEFAULTURL + '/api/webcontent/getActiveWebContent';
  public static loginUrl = Constants.DEFAULTURL + '/api/User/login';
  public static GET_DIRECTOR_URL = Constants.DEFAULTURL + '/api/Director';
  public static SEASON_GAMES_URL = Constants.DEFAULTURL + '/api/Schedulegame/getSeasonGames';

  public static SEASON_DIVISIONS_URL = Constants.DEFAULTURL + '/api/division/GetSeasonDivisions/';
  public static DIVISION_URL = Constants.DEFAULTURL + '/api/Division';
  public static PLAYOFF_GAMES_URL = Constants.DEFAULTURL + '/api/SchedulePlayoff/GetSeasonPlayoffGames';
  public static getCurrentSeasonUrl = Constants.DEFAULTURL + '/api/season/getCurrentSeason';
  public static GET_SEASON_TEAMS_URL = Constants.DEFAULTURL + '/api/Team/GetSeasonTeams/';
  public static getColorUrl = Constants.DEFAULTURL + '/api/Color';
  public static getLocationUrl = Constants.DEFAULTURL + '/api/Location';
  public static teamPostUrl = Constants.DEFAULTURL + '/api/Team';
  public static teamPutUrl = Constants.DEFAULTURL + '/api/Team/';
  public static getContentUrl = Constants.DEFAULTURL + '/api/webcontent';
  public static getActiveContentUrl = Constants.DEFAULTURL + '/api/webcontent/getActiveWebContent';
  public static postContentUrl = Constants.DEFAULTURL + '/api/WebContent';
  public static PUT_CONTENT_URL = Constants.DEFAULTURL + '/api/WebContent/';
  public static GET_SEASON_SPONSORS = Constants.DEFAULTURL + '/api/Sponsor';
  public static getLocations = Constants.DEFAULTURL + '/api/Locations/';
  public static SEASON_URL = Constants.DEFAULTURL + '/api/Season/';
  public static currentSeasonUrl = Constants.DEFAULTURL + '/api/Season/GetCurrentSeason';
  public static peopleUrl = Constants.DEFAULTURL + '/api/People';
  public static GET_ADS_URL = Constants.DEFAULTURL + '/api/Person/GetADs';
  public static GET_STANDINGS_URL = Constants.DEFAULTURL + '/api/ScheduleGame/getStandings';
  public static SEARCH_HOUSEHOLD_URL = Constants.DEFAULTURL + '/api/Household/search';
  public static GET_HOUSEHOLD_MEMBERS_URL = Constants.DEFAULTURL + '/api/Person/GetHouseholdMembers';
  public static PEOPLE_SEARCH_URL = Constants.DEFAULTURL + '/api/Person/search';
  public static SAVE_HOUSEHOLD_URL = Constants.DEFAULTURL + '/api/Household/';


}
export const FEATURE_FLAGS = {
  adminHouseholds: true,  // Enabled feature
  adminNotices: true, // Disabled feature
  adminPeople: false,
  adminDirectors: false,
  adminColors: false,
  adminUsers: false,
  adminGames: true,

};

