using Microsoft.EntityFrameworkCore;
using Sales.Models;
using Sales.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sales.Data
{
    public class UserRepo : IUserRepo
    {
        private ApplicationDbContext context;
        public UserRepo(ApplicationDbContext context)
        {
            this.context = context;
        }


        public async Task<List<User>> GetFilteredUsersAsync(int pageSize, int page, string sortField, string sortOrder)
        {
            var usersQuery = context.Users.AsQueryable();

            if (sortField == "firstName")
                if (sortOrder == "asc")
                    usersQuery = usersQuery.OrderBy(u => u.FirstName);
                else
                    usersQuery = usersQuery.OrderByDescending(u => u.FirstName);
            else if (sortField == "surname")
                if (sortOrder == "asc")
                    usersQuery = usersQuery.OrderBy(u => u.Surname);
                else
                    usersQuery = usersQuery.OrderByDescending(u => u.Surname);
            else if (sortField == "email")
                if (sortOrder == "asc")
                    usersQuery = usersQuery.OrderBy(u => u.Email);
                else
                    usersQuery = usersQuery.OrderByDescending(u => u.Email);
            else
                usersQuery = usersQuery.OrderBy(u => u.FirstName);

            return await usersQuery.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        }

        public async Task<CompareUserVm> GetUserCompareAsync(int userId)
        {
            return await this.context.Users
                .Include(u => u.Sales)
                .Select(u => new CompareUserVm
                {
                    UserId = u.UserId,
                    FirstName = u.FirstName,
                    Surname = u.Surname,
                    TotalVolume = u.Sales.Sum(s => s.Volume)
                })
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task ResetDataAsync()
        {
            await context.Database.ExecuteSqlCommandAsync("exec ResetData_SP");
        }

        public async Task<List<TopUserVm>> GetTopUsersAsync()
        {
            return await context.TopUserVms.FromSql(@"SELECT TOP 10 u.UserId, u.FirstName + ' ' + u.Surname as FullName, SUM(s.Volume) TotalVolume
                                                    FROM Users as u
                                                    LEFT JOIN Sales as s ON u.UserId = s.UserId
                                                    GROUP BY u.UserId, u.FirstName, u.Surname
                                                    ORDER BY SUM(s.Volume) DESC")
                                                    .ToListAsync();
        }

        public Task<int> GetAllUsersCountAsync()
        {
            return context.Users.CountAsync();
        }
    }
}
