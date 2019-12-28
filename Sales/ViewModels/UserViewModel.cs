using Sales.Models;

namespace Sales.ViewModels
{
    public class UserViewModel
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }

        public static UserViewModel MapFromUser(User user)
        {
            return new UserViewModel
            {
                UserId = user.UserId,
                FirstName = user.FirstName,
                Surname = user.Surname,
                Email = user.Email
            };
        }
    }
}