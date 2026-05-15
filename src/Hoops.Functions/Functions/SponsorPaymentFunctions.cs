using System.Net;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Functions.Utils;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Hoops.Functions.Functions
{
    public class SponsorPaymentFunctions
    {
        private readonly ISponsorPaymentRepository _repository;
        private readonly ILogger<SponsorPaymentFunctions> _logger;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        };

        public SponsorPaymentFunctions(ISponsorPaymentRepository repository, ILogger<SponsorPaymentFunctions> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        [Function("SponsorPayment_GetByProfile")]
        [RequireAuth]
        public async Task<HttpResponseData> GetPaymentsByProfile(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "SponsorPayment/ByProfile/{sponsorProfileId:int}")] HttpRequestData req,
            int sponsorProfileId,
            FunctionContext context,
            CancellationToken cancellationToken)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            var payments = await _repository.GetPaymentsAsync(sponsorProfileId);
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, payments);
            return resp;
        }

        [Function("SponsorPayment_Create")]
        [RequireAuth]
        public async Task<HttpResponseData> CreatePayment(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "SponsorPayment")] HttpRequestData req,
            FunctionContext context,
            CancellationToken cancellationToken)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            SponsorPayment? payment;
            try
            {
                payment = await JsonSerializer.DeserializeAsync<SponsorPayment>(req.Body, JsonOptions, cancellationToken);
            }
            catch (JsonException ex)
            {
                _logger.LogWarning(ex, "Invalid JSON body for SponsorPayment create");
                return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest, "Invalid request body");
            }

            if (payment == null)
                return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest, "Missing request body");

            var created = await _repository.AddPaymentAsync(payment);
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, created, HttpStatusCode.Created);
            return resp;
        }

        [Function("SponsorPayment_Update")]
        [RequireAuth]
        public async Task<HttpResponseData> UpdatePayment(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "SponsorPayment/{id:int}")] HttpRequestData req,
            int id,
            FunctionContext context,
            CancellationToken cancellationToken)
        {
            var authError = context.CheckAuthentication(req, _logger);
            if (authError != null) return authError;

            SponsorPayment? payment;
            try
            {
                payment = await JsonSerializer.DeserializeAsync<SponsorPayment>(req.Body, JsonOptions, cancellationToken);
            }
            catch (JsonException ex)
            {
                _logger.LogWarning(ex, "Invalid JSON body for SponsorPayment update");
                return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest, "Invalid request body");
            }

            if (payment == null)
                return ResponseUtils.CreateErrorResponse(req, HttpStatusCode.BadRequest, "Missing request body");

            payment.PaymentId = id;
            var updated = await _repository.UpdatePaymentAsync(payment);
            var resp = req.CreateResponse();
            await ResponseUtils.WriteJsonAsync(resp, updated);
            return resp;
        }
    }
}
