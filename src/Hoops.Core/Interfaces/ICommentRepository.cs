using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;

namespace Hoops.Core.Interface
{
    public interface ICommentRepository
    {
        Task<IEnumerable<Comment>> GetCommentsByLinkIdAsync(int linkId);
    }
}