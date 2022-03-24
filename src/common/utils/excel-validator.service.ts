/**
 * @author Mohit Verma
 *
 * @description collection.service is intended to get and post data to its
 * respective microservice
 */

import { Injectable } from '@nestjs/common';
import { HelperService } from './helper.service';
import { ExcelRuleConstant } from '../constant/excel-rule.constant';
import * as papa from 'papaparse';

@Injectable()
export class ExcelValidatorService {
  constructor(private readonly helperService: HelperService) {}

  /**
   * @description excel upload validator
   * @param {string} key uploaded file name
   * @param {string} rulename  template rule name
   * @returns
   */
  excelValiation = (key, rulename) => {
    const bucketname = process.env.bucketPath;
    const fileData = this.helperService.getS3Stream(bucketname, key);
    return new Promise((resolve) => {
      let count = 2;
      const contener = [];
      papa.parse(fileData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: false,
        worker: true,
        /**
         * @description excel column validate
         * @param {object} result excel result
         * @param {object} parser excel parser
         */
        step: (result, parser) => {
          try {
            const fields = result.meta.fields.map((v) => v.trim());
            const ack = this.validator(
              fields,
              result.data,
              count,
              ExcelRuleConstant[rulename],
            );
            if (ack.error) {
              contener.push({ error: ack.data });
              throw ack.data;
            } else if (Object.keys(ack).length > 0) {
              contener.push(ack);
            }
            count++;
          } catch (e) {
            // eslint-disable-next-line no-undef
            parser.abort();
            // return { error:e+count };
            resolve({ error: e + count });
          }
        },
        /**
         * @description After excel validate column
         * @param {*} valid filecolumn valid
         */
        complete: () => {
          const final = {};
          contener.forEach((v) => {
            for (const [key, value] of Object.entries(v)) {
              if (final[key] != undefined) {
                final[key] = final[key].concat(value);
              } else {
                final[key] = value;
              }
            }
          });
          resolve(final);
        },
      });
    });
  };

  /**
   * @description validator
   * @param {object} fields Fields
   * @param {object} data Data
   * @param {number} count Count
   * @param {number} rule Rule
   * @returns
   */
  validator = (fields, data, count, rule) => {
    const errorStore = {};
    try {
      if (
        Object.keys(fields).length != rule.columnCount &&
        Object.keys(data).length <= rule.columnCount
      )
        throw 'Number of column mismatch!';
      const output = fields.filter((obj) => {
        return rule.columnMatch.indexOf(obj) !== -1;
      });
      if (output.length !== rule.columnCount) throw 'Column name mismatch!';
      const dataVal: any = Object.values(data);

      if (rule.required != undefined) {
        const required = this.splitArr(rule.required);
        const resultRequired = [];
        required.forEach((v) => {
          if (
            dataVal[v] == null ||
            dataVal[v] == undefined ||
            dataVal[v] == ''
          ) {
            resultRequired.push(this.colName(v) + count + '-' + dataVal[v]);
          }
        });
        if (resultRequired.length > 0) {
          errorStore['Value required'] = resultRequired;
        }
      }

      if (rule.eNum != undefined) {
        const eNum = this.splitArr(rule.eNum.columns);
        const resultEnum = [];
        eNum.forEach((v) => {
          if (dataVal[v] != null) {
            if (!rule.eNum.values.includes(dataVal[v])) {
              resultEnum.push(this.colName(v) + count + '-' + dataVal[v]);
            }
          }
        });
        if (resultEnum.length > 0) {
          errorStore['Invalid value eNum'] = resultEnum;
        }
      }

      if (rule.dataType != undefined) {
        const resultDataType = [];
        for (const [key, value] of Object.entries(rule.dataType)) {
          const cell = this.splitArr(value);
          cell.forEach((v) => {
            if (typeof dataVal[v] != key) {
              resultDataType.push(this.colName(v) + count + '-' + dataVal[v]);
            }
          });
        }
        if (resultDataType.length > 0) {
          errorStore['Invalid dataType'] = resultDataType;
        }
      }

      if (rule.pattern != undefined) {
        const pattern = this.splitArr(rule.pattern.columns);
        const resultPattern = [];
        pattern.forEach((v) => {
          if (dataVal[v] != null) {
            const data: any = dataVal[v].split(',');
            data.forEach((value) => {
              if (!rule.pattern.regx.test(value)) {
                resultPattern.push(this.colName(v) + count + '-' + dataVal[v]);
              }
            });
          }
        });
        if (resultPattern.length > 0) {
          errorStore['Invalid value pattern'] = resultPattern;
        }
      }

      if (rule.compare != undefined) {
        const compare = this.splitArr(rule.compare.columns);
        const resultCompare = [];
        const valid = eval(
          dataVal[compare[0]] + rule.compare.condition + dataVal[compare[1]],
        );
        if (!valid) {
          resultCompare.push(
            this.colName(compare[0]) +
              count +
              '-' +
              dataVal[compare[0]] +
              ' ' +
              rule.compare.condition +
              ' ' +
              this.colName(compare[1]) +
              count +
              '-' +
              dataVal[compare[1]],
          );
        }
        if (resultCompare.length > 0) {
          errorStore['Invalid value compare'] = resultCompare;
        }
      }

      // return errorStore;
      return { error: false, data: errorStore };
    } catch (error) {
      return { error: true, data: error };
    }
  };

  /**
   * @description Split Array
   * @param {object} data Data
   * @returns
   */
  splitArr = (data) => {
    let final;
    if (data.length > 1) {
      const between = data[1].split('-');
      if (between.length > 1) {
        final = [this.convertLetterToNumber(data[0])].concat(
          this.range(
            this.convertLetterToNumber(between[0]),
            this.convertLetterToNumber(between[1]),
          ),
        );
      } else {
        final = [this.convertLetterToNumber(data[0])].concat(
          this.convertLetterToNumber(data[1]),
        );
      }
    } else {
      final = [this.convertLetterToNumber(data[0])];
    }
    return final;
  };

  /**
   * @description Convert letter to number
   * @param {object} letters Letters
   */
  convertLetterToNumber = (letters) => {
    let n = 0;
    for (let p = 0; p < letters.length; p++) {
      n = letters[p].charCodeAt() - 64 + n * 26;
    }
    return n - 1;
  };

  /**
   * @description Range
   * @param {number} start start range
   * @param {number} end end range
   */
  range = (start, end) => [...Array(end - start + 1)].map((_, i) => start + i);

  /**
   * @description Colname
   * @param {number} n Col count
   */
  colName = (n) => {
    const ordA = 'a'.charCodeAt(0);
    const ordZ = 'z'.charCodeAt(0);
    const len = ordZ - ordA + 1;

    let s = '';
    while (n >= 0) {
      s = String.fromCharCode((n % len) + ordA) + s;
      n = Math.floor(n / len) - 1;
    }
    return s.toUpperCase();
  };
}
