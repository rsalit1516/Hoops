using System.Collections.Generic;
using Hoops.Core.Entities;

namespace Hoops.Core.ViewModel
{
    public class UserVm
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int HouseId { get; set; }
        public int? PersonId { get; set; }
        public int UserType { get; set; }
        public List<string> Screens { get; set; }
        public List<Division> Divisions { get; set; }

        public static UserVm ConvertToVm(User user, IEnumerable<string> screens, IEnumerable<Division> divisions)
        {
            var userVm = new UserVm();
            userVm.UserId = user.UserId;
            userVm.HouseId = (int)user.HouseId;
            userVm.PersonId = user.PersonId;
            userVm.UserName = user.UserName;
            userVm.UserType = user.UserType ?? 0;
            var splitName = user.Name.Split(' ');
            if (splitName.Length == 2)
            {
                userVm.FirstName = ConvertToProperCase(splitName[0]);
                userVm.LastName = ConvertToProperCase(splitName[1]);
            }
            userVm.Screens = new List<string>();
            foreach (var screen in screens)
            {
                userVm.Screens.Add(screen.Trim());
            }
            userVm.Divisions = new List<Division>();
            foreach (var division in divisions)
            {
                userVm.Divisions.Add(division);
            }
            return userVm;
        }

        private static string ConvertToProperCase(string name)
        {
            // var newName = name.ToLower();
            var sub = name.Substring(0, 1).ToUpper();
            var newName = sub + name.ToLower().Substring(1, name.Length - 1);
            return newName;
        }
    }
}