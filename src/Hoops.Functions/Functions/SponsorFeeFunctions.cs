using System.Threading;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Functions.Utils;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Hoops.Functions.Functions
{
    public class SponsorFeeFunctions
    {
        private readonly ISponsorFeeRepository _repository;
        private readonly ILogger<SponsorFeeFunctions> _logger;

        public SponsorFeeFunctions(ISponsorFeeRepository repository, ILogger<SponsorFeeFunctions> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        [Function("SponsorFee_GetAll")]
        [RequireAuth]
        public async Task<HttpResponseData> GetSponsorFees(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "SponsorFee")] HttpRequestData req,
            FunctionContext context,
            CancellationToken cancellationToken)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            var fees = await _repository.GetAllAsync();
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, fees);
            return resp;
        }
    }
}
