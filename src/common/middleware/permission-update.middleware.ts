import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserErrMessageConstant } from '../constant/error/user-err-message.constant';
import { UserService } from '../../v1/admin/user/user.service';
import jwt_decode from 'jwt-decode';

@Injectable()
export class PermissionUpdateMiddleware implements NestMiddleware {
  constructor(private readonly userServices: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const header = {
      'Content-Type': 'application/json',
      'client-id': process.env.userClientId,
      Authorization: req.headers.authorization,
    };
    const roles = await this.userServices.getRoles(header);
    const jwtDecode: any = jwt_decode(header.Authorization);
    const userId = jwtDecode.data.id;
    const data = await this.userServices.getDepartment(header, userId);
    const weight = ['MANAGEMENT', 'SUPERVISOR', 'EXECUTIVE', 'ASSOCIATE'];
    const id = req.body.id;
    const userData = await this.userServices.getDepartment(header, id);
    if (data.managementUser) {
      next();
    } else {
      const bodyData = req.body;
      bodyData.departments.forEach((value) => {
        const department = data.departments.find(
          (o) => o.departmentId == value.departmentId,
        );
        if (department == undefined) {
          throw new HttpException(
            {
              error: true,
              message: UserErrMessageConstant.access(value.departmentId),
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        const flag = roles.find((o) => o.id === department.role.roleId).name;
        const payLoad1 = roles.find((o) => o.id === value.role.roleId);
        if (payLoad1 == undefined) {
          throw new HttpException(
            {
              error: true,
              message: UserErrMessageConstant.access(value.role.roleId),
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        const payLoad = payLoad1.name;
        if (flag == 'MANAGEMENT') {
          if (
            !value.role.permissions.every((item) =>
              department.role.permissions.includes(item),
            )
          ) {
            throw new HttpException(
              {
                error: true,
                message: UserErrMessageConstant.permissionsDyn(
                  department.role.permissions,
                  value.departmentId,
                  flag,
                ),
              },
              HttpStatus.BAD_REQUEST,
            );
          }
        } else if (flag == 'SUPERVISOR') {
          const departmentOld = userData.departments.find(
            (o) => o.departmentId == value.departmentId,
          );
          if (departmentOld == undefined) {
            throw new HttpException(
              {
                error: true,
                message: UserErrMessageConstant.access(value.departmentId),
              },
              HttpStatus.BAD_REQUEST,
            );
          }
          const flagNew = roles.find(
            (o) => o.id === departmentOld.role.roleId,
          ).name;
          if (weight.indexOf(flagNew) < weight.indexOf(payLoad)) {
            throw new HttpException(
              {
                error: true,
                message: UserErrMessageConstant.degrade(),
              },
              HttpStatus.BAD_REQUEST,
            );
          }

          if (!['SUPERVISOR', 'EXECUTIVE', 'ASSOCIATE'].includes(payLoad)) {
            throw new HttpException(
              {
                error: true,
                message: UserErrMessageConstant.permit,
              },
              HttpStatus.BAD_REQUEST,
            );
          }
          if (
            !value.role.permissions.every((item) =>
              department.role.permissions.includes(item),
            )
          ) {
            throw new HttpException(
              {
                error: true,
                message: UserErrMessageConstant.permissionsDyn(
                  department.role.permissions,
                  value.departmentId,
                  flag,
                ),
              },
              HttpStatus.BAD_REQUEST,
            );
          }
        } else if (flag == 'EXECUTIVE') {
          throw new HttpException(
            {
              error: true,
              message: UserErrMessageConstant.associate(value.departmentId),
            },
            HttpStatus.BAD_REQUEST,
          );
        } else if (flag == 'ASSOCIATE') {
          throw new HttpException(
            {
              error: true,
              message: UserErrMessageConstant.associate(value.departmentId),
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      });
      next();
    }
  }
}
