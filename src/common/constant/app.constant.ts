export class AppConstant {
  public static L1_DATA = 'L1_DATA';
  public static L2_DATA = 'L2_DATA';
  public static L3_DATA = 'L3_DATA';
  public static IMAGE_DIMENSION_L1 = {
    homepageBannerImage: [146, 146],
    categoryPageBannerImage: [320, 160],
  };
  public static IMAGE_DIMENSION_L2 = {
    categoryPageBannerImage: [150, 150],
  };
  public static IMAGE_DIMENSION_L3 = {
    categoryPageBannerImage: [144, 144],
  };
  public static FIELD_DATA_L1 = [
    { name: 'homepageBannerImage', maxCount: 1 },
    { name: 'categoryPageBannerImage', maxCount: 1 },
  ];
  public static FIELD_DATA_L2 = [
    { name: 'categoryPageBannerImage', maxCount: 1 },
  ];
  public static FIELD_DATA_L3 = [
    { name: 'templateFileUrl' },
    { name: 'categoryPageBannerImage' },
  ];

  public static REGX_ALFA_NUMERIC = /^[a-zA-Z0-9\&\-\.\,\(\)[\] ]+$/;
  public static REGX_ONLY_NUMBER = /^[0-9]*$/;
  public static REGEX_PASSWORD_EXP =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,16}$/;

  public static ROUTE_PERMISSION_V1 = [
    {
      method: 'GET',
      route: '/api/v1/admin/categories',
      permission: 'ROLE_VIEW_CATEGORY',
    },
    {
      method: 'PUT',
      route: '/api/v1/admin/categories/status',
      permission: 'ROLE_APPROVE_CATEGORY',
    },
    {
      method: 'POST',
      route: '/api/v1/admin/sub-category',
      permission: 'ROLE_ADD_CATEGORY',
    },
    {
      method: 'POST',
      route: '/api/v1/admin/sub-category/update',
      permission: 'ROLE_EDIT_CATEGORY',
    },
    {
      method: 'POST',
      route: '/api/v1/admin/collection',
      permission: 'ROLE_ADD_CATEGORY',
    },
    {
      method: 'POST',
      route: '/api/v1/admin/collection/update',
      permission: 'ROLE_EDIT_CATEGORY',
    },
    {
      method: 'POST',
      route: '/api/v1/admin/category',
      permission: 'ROLE_ADD_CATEGORY',
    },
    {
      method: 'POST',
      route: '/api/v1/admin/category/update',
      permission: 'ROLE_EDIT_CATEGORY',
    },
  ];
}
