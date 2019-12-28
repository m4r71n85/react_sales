using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sales.Data;
using Sales.ViewModels;

namespace Sales.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepo userRepo;

        public UsersController(IUserRepo userRepo)
        {
            this.userRepo = userRepo;
        }

        // GET: api/users/list
        [HttpGet("list")]
        public async Task<UsersGridViewModel> GetUsers(int pageSize, int page, string sortField = null, string sortOrder = null)
        {
            var usersVm = new UsersGridViewModel
            {
                TotalSize = await userRepo.GetAllUsersCountAsync(),
                UsersData = await userRepo.GetFilteredUsersAsync(pageSize, page, sortField, sortOrder)
            };

            return usersVm;
        }

        // GET: api/users/compare
        [HttpGet("compare")]
        public async Task<ActionResult<CompareUserVm>> GetUserCompareData(int userId)
        {
            var user = await userRepo.GetUserCompareAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // GET: api/users/top
        [HttpGet("top")]
        public async Task<ActionResult<List<TopUserVm>>> GetUser()
        {
            return await userRepo.GetTopUsersAsync();
        }


        // POST: api/Users/reset
        [HttpPost("/api/reset")]
        public async Task<ActionResult> ResetData()
        {
            await userRepo.ResetDataAsync();
            return Ok();
        }
    }
}
