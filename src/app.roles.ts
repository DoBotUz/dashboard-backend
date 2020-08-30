import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
  operator = 'operator',
  manager = 'manager',
  owner = 'owner',
  admin = 'admin'
}

const grantsObject = {
  operator: {
    orders: {
      'create:any': ['*', '!organizationId'],
      'read:any': ['*'],
      'update:any': ['*', '!organizationId'],
      'delete:any': ['*'],
    },
    feedbacks: {
      'read': ['*'],
    },
  },
  [AppRoles.manager]: {

  },
  [AppRoles.owner]: {

  },
  [AppRoles.admin]: {

  }
};

export const roles: RolesBuilder = new RolesBuilder(grantsObject);