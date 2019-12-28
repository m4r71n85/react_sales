using System.Collections.Generic;
using System.Threading.Tasks;
using Sales.Models;
using Sales.ViewModels;

namespace Sales.Data
{
    public interface IUserRepo
    {
        Task<List<User>> GetFilteredUsersAsync(int pageSize, int page, string sortField, string sortOrder);
        Task<List<TopUserVm>> GetTopUsersAsync();
        Task<CompareUserVm> GetUserCompareAsync(int userId);
        Task ResetDataAsync();
        Task<int> GetAllUsersCountAsync();
    }
}