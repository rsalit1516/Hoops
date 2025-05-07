using Hoops.Core.Models;
using Hoops.Core.Interface;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Infrastructure.Repository
{
    public class CommentRepository : EFRepository<Comment>, ICommentRepository 
    {
        private readonly DbContext _context;

        public CommentRepository(DbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Comment>> GetCommentsByLinkIdAsync(int linkId)
        {
            return await _context.Set<Comment>()
                .Where(c => c.LinkID == linkId)
                .ToListAsync();
        }
    }
}