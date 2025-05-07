namespace Hoops.Core.Enum
{
    public static class UserTypes
    {
        /// <summary>
        /// UserType enum
        /// </summary> <summary>
        /// AD = Athletic Director - can input scores
        /// BoardMember - access to the admin section
        /// Player - access to the site is public
        /// </summary>
        public enum UserType { Player = 0, Coach = 1, AD = 2, BoardMember = 3 };

    }
}
