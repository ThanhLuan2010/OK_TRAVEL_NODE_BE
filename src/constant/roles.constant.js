const ALL_ROLE = Object.freeze({
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
  STAFF: 'ROLE_STAFF',
});

const allAdminRoles = {
  MANAGER: ['read', 'update-my-info'],
  ADMIN: ['read', 'edit', 'write', 'update-my-info'],
  SUPER_ADMIN: ['read', 'write', 'edit', 'delete', 'all', 'update-my-info'],
};

const roleAdmin = Object.keys(allAdminRoles);
const roleRights = new Map(Object.entries(allAdminRoles));

module.exports = {
  ALL_ROLE,
  roleRights,
  roleAdmin,
};
