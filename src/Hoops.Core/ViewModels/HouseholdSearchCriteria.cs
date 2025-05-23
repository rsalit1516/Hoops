#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hoops.Core.ViewModels
{
    public class HouseholdSearchCriteria
    {
        public string? Name { get; set; } 
        public string? Address { get; set; } 
        public string? Email { get; set; } 
        public string? Phone { get; set; }
    }
}