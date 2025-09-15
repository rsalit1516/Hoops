using Hoops.Core.Models;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq.Expressions;
using Hoops.Infrastructure.Data;
using Hoops.Core.Interface;

namespace Hoops.Infrastructure.Repository
{
    public class UserRepository : EFRepository<User>, IUserRepository
    {
        private new readonly hoopsContext context;

        public UserRepository(hoopsContext context) : base(context)
        {
            this.context = context;
            sSQL = string.Empty;
        }


        // private readonly hoopsContext context;
        // protected DbSet<User> DbSet;
        private string sSQL;

        #region IRepository<T> Members
        public override User Insert(User entity)
        {

            entity.UserId = context.Users.Any() ? context.Users.Max(t => t.UserId) + 1 : 1;
            var newUser = context.Users.Add(entity);
            var no = context.SaveChanges();
            return context.Users.FirstOrDefault(user => user.UserName == entity.UserName)!;

        }
        public override User Update(User entity)
        {
            var user = GetById(entity.UserId);
            user = entity;
            context.SaveChanges();
            return user!;
        }
        public override void Delete(User entity)
        {
            context.Users.Remove(entity);
        }

        public IQueryable<User> SearchFor(Expression<Func<User, bool>> predicate)
        {
            return context.Users.Where(predicate);
        }

        // public IQueryable<User> GetAll()
        // {
        //     return context.Users.Select(s => s);
        // }
        public IQueryable<User> GetAll(int companyId)
        {
            return context.Users.Where(s => s.CompanyId == companyId);
        }

        public IQueryable<User> GetByUserType(int userType)
        {
            return context.Users.Where(s => s.UserType == userType);
        }

        // public User GetById(int id)
        // {
        //     return context.Users.Find(id);
        // }

        #endregion

        public User GetUser(string sUserName, string password)
        {
            try
            {
                // Hash the input password to compare with stored encrypted password
                var hashedPassword = HashPassword(password);

                var user = context.Users
                .FirstOrDefault(u =>
                u.UserName.ToLower() == sUserName.ToLower()
                && (u.PassWord == hashedPassword || u.Pword == password)); // Support both encrypted and plain text for compatibility

                if (user == null)
                {
                    throw new Exception("Invalid username or password.");
                }
                return user;
            }
            catch (Exception ex)
            {
                throw new Exception("ClsUsers:GetUser::" + ex.Message);
            }

        }

        public Task<User?> GetUserAsync(string sUserName, string sPwd)
        {
            var db = new hoopsContext();

            try
            {
                //var repo = new UserRepository(DB);
                var user = db.Users.FirstOrDefaultAsync(u => u.Name.ToLower() == sUserName.ToLower());
                return user ?? Task.FromException<User?>(new Exception("User not found"));
            }
            catch (Exception ex)
            {
                throw new Exception("ClsUsers:GetUser::" + ex.Message);
            }

        }
        public String Quo(String InString)
        {
            String newString;
            newString = InString.Replace("'", "''");
            return "'" + newString + "'";
        }
        public String Quotes(String @in)
        {
            String @out;
            @out = @in.Replace("'", "''");
            return "'" + @out.ToUpper() + "'";
        }

        //TODO:: Company
        //Public Sub GetCompanyInfo(ByVal iUserID As Int32, ByVal SeasonID As Int32)
        //    Dim DB As New ClsDatabase
        //    Dim dtResults As DataTable
        //    Try
        //        sSQL = "EXEC CompanyInfo @UserID = " & sGlobal.Quo(iUserID)
        //        sSQL += ", @SeasonID = " & SeasonID
        //        dtResults = DB.ExecuteGetSQL(sSQL)
        //        CompanyID = dtResults.Rows(0).Item("CompanyID").ToString
        //        CompanyName = dtResults.Rows(0).Item("CompanyName").ToString
        //        ImageName = dtResults.Rows(0).Item("ImageName").ToString
        //        TimeZone = dtResults.Rows(0).Item("TimeZone").ToString
        //        SeasonID = dtResults.Rows(0).Item("SeasonID").ToString
        //        UserName = dtResults.Rows(0).Item("UserName").ToString
        //        SeasonDesc = dtResults.Rows(0).Item("Sea_Desc").ToString
        //    Catch ex As Exception
        //        Throw New Exception("ClsUsers:GetCompanyInfo::" & ex.Message)
        //    Finally
        //        DB = Nothing
        //        dtResults = Nothing
        //    End Try

        //End Sub

        public DataTable GetSeason(Int32 CompanyID)
        {
            var DB = new hoopsContext();
            DataTable? dtResults = default(DataTable);

            try
            {
                sSQL = "SELECT SeasonID, Sea_Desc, FromDate FROM Seasons WHERE Seasons.CurrentSeason=1";
                sSQL += " AND CompanyID = " + Quo(CompanyID.ToString());
                //TODO:: Company
                sSQL = "SELECT SeasonID, Sea_Desc, FromDate FROM Seasons WHERE Seasons.CurrentSeason=1";
                // dtResults = DB.ExecuteGetSQL(sSQL);
                return dtResults ?? new DataTable();
            }
            catch (Exception ex)
            {
                throw new Exception("ClsUsers:GetSeason::" + ex.Message);
            }
        }

        public User GetLoginInfo(string userName, string password)
        {
            var db = new hoopsContext();

            try
            {
                var repo = new UserRepository(db);
                var user = repo.GetUser(userName, password);
                return user!;
                // sSQL = "SELECT SeasonID, Sea_Desc, FromDate FROM vw_CheckLogin WHERE Seasons.CurrentSeason=1";
                //sSQL += " AND CompanyID = " + sGlobal.Quo(CompanyID.ToString());
                //dtResults = db.ExecuteGetSQL(sSQL);
            }
            catch (Exception ex)
            {
                throw new Exception("ClsUsers:GetSeason::" + ex.Message);
            }

        }

        public Task<User?> GetLoginInfoAsync(string userName, string password)
        {
            var db = new hoopsContext();

            try
            {
                var repo = new UserRepository(db);
                var user = repo.GetUserAsync(userName, password);
                return user!;
                // sSQL = "SELECT SeasonID, Sea_Desc, FromDate FROM vw_CheckLogin WHERE Seasons.CurrentSeason=1";
                //sSQL += " AND CompanyID = " + sGlobal.Quo(CompanyID.ToString());
                //dtResults = db.ExecuteGetSQL(sSQL);
            }
            catch (Exception ex)
            {
                throw new Exception("ClsUsers:GetSeason::" + ex.Message);
            }

        }
        /*
        public void DELUserPtn(long HouseId, Int32 CompanyID)
        {
            var DB = new hoopsContext;
            DataTable dtResults = default(DataTable);
            var sGlobal = new ClsGlobal();
            try {
                sSQL = "Update USERS set HouseId = " + Constants.vbNull;
                sSQL += " where HouseId=" + HouseId;
                sSQL += " AND CompanyID = " + CompanyID;
                //TODO:: Company
                sSQL = "Update USERS set HouseId = " + Constants.vbNull;
                sSQL += " where HouseId=" + HouseId;
                DB.ExecuteUpdSQL(sSQL);
            } catch (Exception ex) {
                throw new Exception("ClsUsers:DELUserPtn::" + ex.Message);
            } finally {
                DB = null;
            }
        }
        */
        public string HashPassword(string password)
        {
            string? hashedPassword = null;
            // dynamic hashProvider = new SHA256Managed();
            try
            {
                byte[]? passwordBytes = null;
                //Dim hashBytes() As Byte
                passwordBytes = System.Text.Encoding.Unicode.GetBytes(password);
                //hashProvider = New SHA256Managed
                // hashProvider.Initialize();
                // passwordBytes = hashProvider.ComputeHash(passwordBytes);
                hashedPassword = Convert.ToBase64String(passwordBytes);
            }
            finally
            {
                // if ((hashProvider != null))
                // {
                //     hashProvider.Clear();
                //     hashProvider = null;
                // }
            }
            return hashedPassword;

        }

        public string GetAccess(Int32 iUserID, string sScreen, Int32 iCompanyID, Int32 iSeasonID = 0)
        {
            var DB = new hoopsContext();
            DataTable? dtResults = default(DataTable);
            var accessType = "NoAccess";
            try
            {
                sSQL = "EXEC GetAccess";
                sSQL += " @UserCode = " + iUserID;
                sSQL += ", @Screen = " + Quo(sScreen);
                sSQL += ", @SeasonID = " + iSeasonID;
                sSQL += ", @CompanyID = " + iCompanyID;
                //TODO:: Company
                sSQL = "EXEC GetAccess";
                sSQL += " @UserCode = " + iUserID;
                sSQL += ", @Screen = " + Quo(sScreen);
                sSQL += ", @SeasonID = " + iSeasonID;
                // dtResults = DB.ExecuteGetSQL(sSQL);
                if (dtResults != null && dtResults.Rows.Count > 0)
                {
                    accessType = dtResults.Rows[0]["accesstype"].ToString();
                }
                else
                {
                    throw new Exception("No access type found.");
                }
            }
            catch (Exception ex)
            {
                throw new Exception("ClsUsers:GetAccess::" + ex.Message);
            }
            finally
            {
                DB = null;
                dtResults = null;

            }
            return accessType!;
        }

        public void GetEmail(int CompanyID, string sUserName)
        {
            var DB = new hoopsContext();
            DataTable? dtResults = default;
            try
            {
                sSQL = "exec CheckEmail @UName=" + Quotes(sUserName);
                sSQL += ", @CompanyID = " + CompanyID;
                //TODO:: Company
                sSQL = "exec CheckEmail @UName=" + Quotes(sUserName);
                // dtResults = DB.ExecuteGetSQL(sSQL);
                if (dtResults != null && dtResults.Rows.Count > 0)
                {
                    var user = new User
                    {
                        //user.Email = dtResults.Rows[0]["Email"].ToString();
                        Pword = dtResults.Rows[0]["PWord"].ToString()
                    };
                }
            }
            catch (Exception ex)
            {
                throw new Exception("ClsUsers:GetEmail::" + ex.Message);
            }
            finally
            {
                DB = null;
                dtResults = null;
            }
        }
        /*
        public void AddUser(User user, Int32 iTimeZone)
        {
            var DB = new hoopsContext;
            DataTable dtResults = default(DataTable);
            var sGlobal = new ClsGlobal();
            try {
                sSQL = "EXEC sp_UpdUser ";
                sSQL += " @UserId = 0";
                sSQL += ", @UserName = " + user.UserName);
                sSQL += ", @Name = " + user.Name);
                sSQL += ", @PWord = " + user.PWord);
                sSQL += ", @Password = " + dbStrField("", HashPassword(PWord));
                sSQL += ", @UserType = " + dbIntField(0, Usertype);
                sSQL += ", @HouseID = " + dbStrField("", HouseID);
                sSQL += ", @CompanyID = " + dbStrField("", CompanyID);
                sSQL += ", @Roles = " + dbStrField("", Strings.Space(1));
                sSQL += ", @CreatedUser = " + dbStrField("", CreatedUser);
                sSQL += ", @CreatedDate = " + sGlobal.Quo(sGlobal.TimeAdjusted(iTimeZone, Now()));

                dtResults = DB.ExecuteGetSQL(sSQL);
                UserID = Int32.Parse(dtResults.Rows[0]["UserID"].ToString());

            } catch (Exception ex) {
                throw new Exception("ClsUsers:AddUser::" + ex.Message);
            } finally {
                DB = null;
            }
        }
        */
        public void UpdPWD(User user)
        {
            var DB = new hoopsContext();

            try
            {
                sSQL = "EXEC sp_UpdPWD ";
                sSQL += " @UserName = " + user.UserName;
                sSQL += ", @PWord = " + user.Pword;
                sSQL += ", @Password = " + HashPassword(user.PassWord);
                sSQL += ", @CompanyID = " + user.CompanyId.ToString();
                // ToDo: Fix This
                // DB.ExecuteGetSQL(sSQL);

            }
            catch (Exception ex)
            {
                throw new Exception("ClsUsers:UpdPWD::" + ex.Message);
            }
        }
        public User GetUserByHouseId(int houseId)
        {
            var user = context.Users.FirstOrDefault(u => u.HouseId == houseId);
            return user!;
        }

        User IRepository<User>.Insert(User entity)
        {
            throw new NotImplementedException();
        }
    }
}

