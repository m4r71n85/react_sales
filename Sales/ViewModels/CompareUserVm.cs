using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sales.ViewModels
{
    public class CompareUserVm
    {
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public int TotalVolume { get; set; }
        public int UserId { get; internal set; }
    }
}
