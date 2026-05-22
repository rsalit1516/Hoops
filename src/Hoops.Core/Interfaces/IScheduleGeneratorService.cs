using System.Threading.Tasks;
using Hoops.Core.ViewModels;

namespace Hoops.Core.Interface
{
    public interface IScheduleGeneratorService
    {
        Task<ScheduleGeneratorResult> PreviewAsync(ScheduleGeneratorRequest request);
        Task<ScheduleCommitResult> CommitAsync(ScheduleCommitRequest request);
    }
}
