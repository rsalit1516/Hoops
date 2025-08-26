using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Data;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace Hoops.Functions.Functions
{
    public class DebugFunctions
    {
        private readonly SeedCoordinator _seedCoordinator;
        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true
        };
        public DebugFunctions(SeedCoordinator seedCoordinator)
        {
            _seedCoordinator = seedCoordinator;
        }

        [Function("ReseedData")]
        public async Task<HttpResponseData> ReseedData(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "Debug/reseed")] HttpRequestData req)
        {
            try
            {
                Console.WriteLine("[DEBUG] Manual reseed triggered...");
                await _seedCoordinator.InitializeDataAsync();
                Console.WriteLine("[DEBUG] Manual reseed completed.");
                var ok = req.CreateResponse(HttpStatusCode.OK);
                await ok.WriteStringAsync("Data reseeded successfully");
                return ok;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DEBUG] Reseed failed: {ex.Message}");
                var bad = req.CreateResponse(HttpStatusCode.BadRequest);
                await bad.WriteStringAsync($"Reseed failed: {ex.Message}");
                return bad;
            }
        }
    }
}
