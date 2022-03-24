export class CategoryErrMessageConstant {
  public static id = 'category id is required!';
  public static parentCategoryId = 'category collection id is required!';
  public static categoryPageBannerImage = 'category image Url is required!';
  public static nameCheck =
    'category name is required and support only alphaNumeric and some special char like - & [] ()!';
  public static status = 'category status is required must be boolean!';
  public static description =
    'category description support only alphaNumeric and some special char like - & [] ()!';
  public static levels = 'Required (L1,L2,L3) levels';
  public static levelcountmsg = 'Levels should not more then three levels';
  public static levelmatch = 'Levels should be like(L1,L2,L3)';
  public static levelDuplicate = 'Duplciate levels cant support';
}
