export class CategoriesStatusErrMessageConstant {
  public static id = 'id is required and must be integer';
  public static checkerStatus =
    'checkerStatus is required and must be like (APPROVED/REJECTED)';
  public static requestBodyFormat =
    'Request body must be array of object format like [{}]';
  public static rejectReason = 'Rejected reason is required';
  public static rejectReasonCharCount = 'Rejected reason more then 4 character';
  public static duplicateId = 'Duplicate id can not support';
  public static appovedReasonMsg =
    'In approved status is not required rejected reason';
}
