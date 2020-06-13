using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Linq;
using System.Data;
using Hoops.Infrastructure.Interface;
using Hoops.Core.Entities;

namespace Hoops.Infrastructure.Repository
{
    public class RoleRepository : EFRepository<Role>, IRoleRepository
    {

        protected hoopsContext DataContext { get; set; }
        // protected DbSet<Role> DbSet;

        public RoleRepository(hoopsContext context) : base(context) { }

        #region IRepository<T> Members

        // public IQueryable<Role> SearchFor(Expression<Func<Role, bool>> predicate)
        // {
        //     return context.Roles.Where(predicate.);
        // }

        public override IEnumerable<Role> GetAll()
        {
            return context.Roles.Select(s => s);
        }

        public Role GetById(decimal id)
        {
            return context.Roles.Find(id);
        }

        #endregion

        public override Role Insert(Role entity)
        {
            if (entity.RoleId == 0)
            {
                entity.RoleId = context.Roles.Any() ? (context.Roles.Max(p => p.RoleId) + 1) : 1;
            }
            entity.CreatedDate = DateTime.Now;
            context.Roles.Add(entity);
            var no = context.SaveChanges();
            return entity;
        }

        void IRepository<Role>.Delete(Role entity)
        {
            throw new NotImplementedException();
        }



        Role IRepository<Role>.GetById(int id)
        {
            throw new NotImplementedException();
        }

        // public decimal Create(Role role)
        // {
        //     if (role.RoleId == 0)
        //     {
        //         role.RoleId = context.Roles.Any() ? context.Roles.Max(c => c.RoleId) + 1 : 1;
        //     }
        //     Role newRole = context.Roles.Add(role);
        //     context.SaveChanges();
        //     return newRole.RoleId;

        // }

        public IQueryable<Role> GetRoles(int userId)
        {
            var roles = context.Roles.Where(r => r.UserId == (decimal)userId);        
            return roles;

        }
        public bool DeleteById(int id)
        {
            bool tflag = false;

            var Role = context.Roles.Find(id);
            if (Role != null)
            {
                context.Roles.Remove(Role);
                context.SaveChanges();
                tflag = true;
            }
            return tflag;
        }
        public override Role Update(Role role)
        {
            var old = GetById(Convert.ToDecimal(role.RoleId));
            old = role;
            context.SaveChanges();
            return role;
        }

        public void DeleteUserRole(decimal p, string screenName)
        {
            var role = context.Roles.FirstOrDefault(r => r.UserId == p && r.ScreenName == screenName);
            if (role != null)
            {
                context.Roles.Remove(role);
                context.SaveChanges();
            }
        }
        public void AddUserRole(int userId, string screenName, string userName)
        {
            var existingRole = context.Roles.FirstOrDefault(r => r.UserId == userId && r.ScreenName == screenName);
            if (existingRole == null)
            {
                var role = new Role();
                role.UserId = userId;
                role.AccessType = "U";
                role.ScreenName = screenName.ToUpper();
                role.CreatedUser = userName;
                Insert(role);
                context.SaveChanges();
            }
        }
    }
}

