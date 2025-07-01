
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;

namespace Hoops.Data.Seeders
{
    public interface ISeeder<T>
    {

        Task SeedAsync();
    }
}