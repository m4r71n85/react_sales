using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sales.Data;
using Sales.Models;
using Sales.ViewModels;

namespace Sales.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/users/list
        [HttpGet("list")]
        public async Task<ActionResult<UsersGridViewModel>> GetUsers(int pageSize, int page, string sortField=null, string sortOrder=null)
        {
            //todo: move to repo
            var usersVm = new UsersGridViewModel
            {
                TotalSize = await _context.Users.CountAsync()
            };
            var usersQuery = _context.Users.AsQueryable();

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

            usersVm.UsersData = await usersQuery.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return usersVm;
        }

        // GET: api/users/sales/5
        [HttpGet("sales")]
        public async Task<ActionResult<CompareUserVm>> GetUser(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Sales)
                .Select(u => new CompareUserVm
                {
                    UserId = u.UserId,
                    FirstName = u.FirstName,
                    Surname = u.Surname,
                    TotalVolume = u.Sales.Sum(s => s.Volume)
                })
                .FirstOrDefaultAsync(u => u.UserId == userId);
                
            if (user == null)
            {
                return NotFound();
            }

            return user;
        }


        // POST: api/Users/reset
        [HttpPost("/api/reset")]
        public async Task<ActionResult> ResetData()
        {
            await _context.Database.ExecuteSqlCommandAsync("exec ResetData_SP");

            return Ok();
        }
    }
}
