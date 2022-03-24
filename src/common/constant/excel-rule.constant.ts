export class ExcelRuleConstant {
  /**
   * @description String to Url function
   * @param {*} value Value
   */
  public static template1 = {
    columnCount: 7,
    columnMatch: [
      'name',
      'address',
      'pin',
      'product-size',
      'product-color',
      'size',
      'fabric',
    ],
    required: ['A', 'C-G'],
    eNum: {
      columns: ['C', 'D'],
      values: ['test1', 'test2'],
    },
    dataType: {
      string: ['C', 'D-F'],
      number: ['A', 'B'],
    },
    pattern: {
      columns: ['E'],
      regx: /\S+@\S+\.\S+/,
    },
    compare: {
      columns: ['A', 'B'],
      condition: '>',
    },
  };

  public static template2 = {
    columnCount: 30,
    columnMatch: [
      'SKU ID',
      'GROUP ID',
      'PRODUCT ID',
      'Product Name',
      'Brand',
      'Maximum Retail Price (Rs.)',
      'Selling Price (Rs.)',
      'Description',
      'Material Care',
      'Discount (0-100)',
      'Discount start date (YYYY-MM-DD)',
      'Discount end date (YYYY-MM-DD)',
      'Country of Origin',
      'Guarantee',
      'Key Features',
      'Manufacturing Date (YYYY-MM-DD)',
      'Re-stock Date (YYYY-MM-DD)',
      'Video URL',
      'Warranty',
      'Image 1 URL',
      'Image 2 URL',
      'Image 3 URL',
      'Image 4 URL',
      'Image 5 URL',
      'Length (with units)',
      'Breadth (with units)',
      'Height (with units)',
      'Weight (with units)',
      'HSN Code',
      'Offers',
    ],
  };
}
