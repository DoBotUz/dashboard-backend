import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
  operator = 'operator',
  manager = 'manager',
  owner = 'owner',
  admin = 'admin'
}

const grantsObject = {
  [AppRoles.operator]: {
      video: {
          'create:any': ['*', '!views'],
          'read:any': ['*'],
          'update:any': ['*', '!views'],
          'delete:any': ['*']
      }
  },
  [AppRoles.manager]: {
      video: {
          'create:own': ['*', '!rating', '!views'],
          'read:own': ['*'],
          'update:own': ['*', '!rating', '!views'],
          'delete:own': ['*']
      }
  },
  [AppRoles.owner]: {
    video: {
        'create:own': ['*', '!rating', '!views'],
        'read:own': ['*'],
        'update:own': ['*', '!rating', '!views'],
        'delete:own': ['*']
    }
  },
  [AppRoles.admin]: {
    video: {
        'create:own': ['*', '!rating', '!views'],
        'read:own': ['*'],
        'update:own': ['*', '!rating', '!views'],
        'delete:own': ['*']
    }
  }
};

export const roles: RolesBuilder = new RolesBuilder(grantsObject);