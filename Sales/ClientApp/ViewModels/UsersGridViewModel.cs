using Sales.Models;
using System.Collections.Generic;

namespace Sales.ViewModels
{
    public class UsersGridViewModel
    {
        //todo use user vm
        public List<User> UsersData { get; set; }
        public int TotalSize { get; set; }
    }
}
