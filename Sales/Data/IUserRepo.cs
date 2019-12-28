using System.Collections.Generic;
using System.Threading.Tasks;
using Sales.Models;
using Sales.ViewModels;

namespace Sales.Data
{
    /// <summary>
    /// User service layer giving access to user records and their sales.
    /// </summary>
    public interface IUserRepo
    {
        /// <summary>
        /// Gets users and applies pagination filtering, also sorts the results depending on passed arguments
        /// </summary>
        /// <param name="pageSize">Amount of user records per page</param>
        /// <param name="page">Page of user records</param>
        /// <param name="sortField">Sort records by the field provided</param>
        /// <param name="sortOrder">Sort 'asc' or 'desc'</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a
        /// System.Collections.Generic.List`1 that contains elements of User type.</returns>
        Task<List<User>> GetFilteredUsersAsync(int pageSize, int page, string sortField, string sortOrder);

        /// <summary>
        /// Gets top 10 users that have the most total sales amount.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation. The task result contains a
        /// System.Collections.Generic.List`1 that contains elements of TopUserVm type.</returns>
        Task<List<TopUserVm>> GetTopUsersAsync();

        /// <summary>
        /// Get a user by userId containing data about the amount of sales that he has.
        /// </summary>
        /// <param name="userId">Provude data for User with that userId.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains an
        /// element of CompareUserVm.</returns>
        Task<CompareUserVm> GetUserCompareAsync(int userId);

        /// <summary>
        /// Deletes all records from Users and Sales and then seeds new data.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation.</returns>
        /// <remarks>
        /// Generates 100 Users records in using random names and email based on the following possible entries:
        /// Name: Martin, John, Benjamin, Lisa, Maria, Sonya, Philip, Jose, George, Justin
        /// Surname: Johnson, Lamas, Jackson, Brown, Mason, Rodriguez, Roberts, Thomas, Rose
        /// Domain: hotmail.com, gmail.com, live.com
        /// The email is constructed using the following pattern:  <firstName>.<surname>@<domain>
        /// For every User record generate random number(between 1 and 20) of Sale records with random three-letter ProductCode and random Volume(1-200)
        /// </remarks>
        Task ResetDataAsync();

        /// <summary>
        /// Gets the total count of all user records.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation. The task result contains an
        /// elements of type int.</returns>
        Task<int> GetAllUsersCountAsync();
    }
}