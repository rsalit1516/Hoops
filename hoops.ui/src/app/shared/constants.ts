import {environment} from '../../environments/environment';
export class Constants {
  public static ALLTEAMS = 'All Teams';
  public static DEFAULTURL = environment.apiUrl;

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
  baseUrl = Constants.DEFAULTURL;
  dotNetCoreUrl = environment.apiUrl;
  getActiveWebContentUrl = this.dotNetCoreUrl + '/api/webcontent/getActiveWebContent';
  loginUrl = this.baseUrl + '/api/User/login';
  directorUrl = this.baseUrl + '/api/Director';
  seasonGamesUrl = this.baseUrl + '/api/Schedulegame/getSeasonGames';
  seasonDivisionsUrl = this.baseUrl + '/api/division/GetSeasonDivisions/';
  playoffGameUrl = this.baseUrl + '/api/SchedulePlayoff/GetSeasonGames';
  getCurrentSeasonUrl = this.baseUrl + '/api/season/getCurrentSeason';
  getSeasonTeamsUrl = this.baseUrl + '/api/Team/GetSeasonTeams/';
  getColorUrl = this.baseUrl + '/api/Color';
  getLocationUrl = this.baseUrl + '/api/Location';
  teamPostUrl = this.baseUrl + '/api/Team';
  teamPutUrl = this.baseUrl + '/api/Team/';
  getContentUrl = this.baseUrl + '/api/webcontent';
  getActiveContentUrl = this.baseUrl + '/api/webcontent/getActiveWebContent';
  postContentUrl = this.baseUrl + '/api/WebContent';
  putContentUrl = this.baseUrl + '/api/WebContent/';
  getCurrentSponsors = this.baseUrl + '/api/Sponsor/GetSeasonSponsors/';
  getLocations = this.baseUrl + '/api/Locations/';
  seasonUrl = this.baseUrl + '/api/Season/';
  currentSeasonUrl = this.baseUrl + '/api/Season/GetCurrentSeason';
  peopleUrl = this.baseUrl + '/api/People';
  getADsUrl = this.baseUrl + '/api/People/GetADs';
  standingsUrl = this.baseUrl + '/api/ScheduleGame/getStandings';

}
