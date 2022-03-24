export class UserErrMessageConstant {
  public static id = 'id is required and must be integer';
  public static page = 'page is required and must be integer';
  public static size = 'size is required and must be integer';
  public static createdByUserId = 'createdByUserId must be a valid id';
  public static fullName = 'fullName must be less then 100 character';
  public static email = 'valid email is required';
  public static mobile = 'valid mobile is required';
  public static type = 'type is required and must be string';
  public static isMGMTUser = 'isMGMTUser is required and must be boolean';
  public static departments = 'departments is required and must be array';
  public static deptId = 'deptId is required and must be string';
  public static roleId = 'roleId is required and must be string';
  public static userType = 'userType is required and must be string';
  public static permissions = 'permissions is required and must be array';
  public static permit =
    'you have only SUPERVISOR, EXECUTIVE and ASSOCIATE permission';
  public static isMGMTUserCheck = "you can't create Management user";
  public static denied = 'you are not authorize to delete the user';
  /**
   * @description Error string in the case when user does not have sufficient permission to create/update user
   * @param {string} deptId department id/name
   */
  public static associate = (deptId) => {
    return `you are not authorised to create user in this ${deptId}`;
  };
  /**
   * @description Error string in the case when user does not have sufficient permission to create/update user
   * @param {string} permissions department id/name
   * @param {string} deptId department id/name
   * @param {string} flag role id/name
   */
  public static permissionsDyn = (permissions, deptId, flag) => {
    return `you have only ${permissions} permissions as ${deptId} ${flag}`;
  };
  /**
   * @description Error string in the case when user does not have sufficient permission to update user
   */
  public static degrade = () => {
    return 'degrade not allowed';
  };
  /**
   * @description Error string in the case when user does not have sufficient permission to create/update user
   * @param {string} deptId department id/name
   */
  public static access = (deptId) => {
    return `access denied for ${deptId} department`;
  };
}
