using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hoops.Core.Entities;

namespace Hoops.Infrastructure.Interface
{
    public interface IScheduleDivTeamsRepository : IRepository<ScheduleDivTeam>
    {
        int GetTeamNo(int scheduleNo, int teamNo);
    }
}
