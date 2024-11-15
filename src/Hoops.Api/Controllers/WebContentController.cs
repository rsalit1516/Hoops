using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Microsoft.Extensions.Logging;
using Hoops.Core.Interface;
using System.Linq;

namespace Hoops.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebContentController : ControllerBase
    {
        // private readonly hoopsContext _context;

        public IWebContentRepository repository { get; set; }
        private readonly ILogger<WebContentController> _logger;

        /// <summary>
        /// WebContentController
        /// </summary>
        /// <param name="_webContent"></param>
        public WebContentController( IWebContentRepository _webContent, ILogger<WebContentController> logger )
        {
            this.repository = _webContent;
             _logger = (ILogger<WebContentController>)logger;
            _logger.LogDebug(1, "NLog injected into Web Content Controller");
        }

        /// <summary>
        /// Get
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult<IEnumerable<WebContent>> GetWebContent()
        {
            return Ok(repository.GetAll().OrderByDescending(x => x.ExpirationDate));
        }

        // GET: api/WebContent/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetWebContent(int id)
        {
            return Ok(await repository.GetActiveWebContentAsync(1));
        }

        /// <summary>
        /// Get
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetActiveWebContent")]
        public async Task<IActionResult> GetActiveWebContent()
        {
            return Ok(await repository.GetActiveWebContentAsync(1));
        }

        /// <summary>
        /// Put for updating web content
        /// </summary>
        /// <param name="patch"></param>
        /// <returns></returns>
        [HttpPut]
        public IActionResult Put(WebContent patch)
        {
            var key = patch.WebContentId;

            //    Validate(patch.GetEntity());
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            repository.Update(patch);
            repository.SaveChanges();
            // _context.WebContents.Update(patch);
            // _context.SaveChanges();

            // if (webContent == null)
            // {
            //     return NotFound();
            // }
            // TO DO: need to fix this!
            // patch.Put(webContent);
            // try
            // {
            //     Contents.Update (patch);
            // }
            // catch (System.Exception)
            // {
            //     if (!WebContentExists(key))
            //     {
            //         return NotFound();
            //     }
            //     else
            //     {
            //         throw;
            //     }
            // }
            return Ok(repository.GetById(((int)patch.WebContentId)));
        }

        // PUT: api/WebContent/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public IActionResult
        PutWebContent(int id, WebContent webContent)
        {
            if (id != webContent.WebContentId)
            {
                return BadRequest();
            }

            repository.Update(webContent);
            repository.SaveChanges();

            return Ok(webContent);
        }

        // POST: api/WebContent
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public ActionResult<WebContent> PostWebContent(WebContent webContent)
        {
            _logger.LogInformation("Updating new controller");
            _logger.LogInformation(webContent.WebContentId.ToString());
            _logger.LogInformation(webContent.Title);
            _logger.LogInformation(webContent.WebContentTypeId.ToString());
            // _logger.LogInformation(webContent.WebContentType.WebContentTypeId.ToString());
            var content = repository.Insert(webContent);
            return Ok(content);
        }

        // DELETE: api/WebContent/5
        [HttpDelete("{id}")]
        public ActionResult<WebContent> DeleteWebContent(int id)
        {
            var webContent = repository.GetById(id);
            if (webContent == null)
            {
                return NotFound();
            }
            repository.Delete(webContent);
            return Ok(webContent);
            // await _context.SaveChangesAsync();
        }

        private bool WebContentExists(int id)
        {
            return repository.GetById(id) != null;
        }
    }
}
