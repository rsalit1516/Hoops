using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Hoops.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository _commentRepository;

        public CommentController(ICommentRepository commentRepository)
        {
            _commentRepository = commentRepository;
        }

        [HttpGet("link/{linkId}")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsByLinkId(int linkId)
        {
            var comments = await _commentRepository.GetCommentsByLinkIdAsync(linkId);
            return Ok(comments);
        }
    }
}