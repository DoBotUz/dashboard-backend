import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
  operator = 'operator',
  manager = 'manager',
  owner = 'owner',
  admin = 'admin'
}

const grantsObject = {
  [AppRoles.operator]: {
    orders: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    feedbacks: {
      'read': ['*'],
    },
    categories: {
      'read:any': ['*'],
    },
    items: {
      'read:any': ['*'],
    },
    promocodes: {
      'read:any': ['*'],
    },
    branches: {
      'read:any': ['*'],
    },
    'bot-users': {
      'read:any': ['*'],
      'update:any': ['*'],
    },
    organizations: {
      'read:any': ['*'],
    },
  },
  [AppRoles.manager]: {
    orders: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    feedbacks: {
      'read': ['*'],
    },
    categories: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    items: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    promocodes: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    branches: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    'mailing-templates': {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    'bot-users': {
      'read:any': ['*'],
      'update:any': ['*'],
    },
    organizations: {
      'read:any': ['*'],
    },
  },
  [AppRoles.owner]: {
    orders: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    feedbacks: {
      'read': ['*'],
    },
    categories: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    items: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    promocodes: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    branches: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    'mailing-templates': {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    'bot-users': {
      'read:any': ['*'],
      'update:any': ['*'],
    },
    organizations: {
      'update:any': ['*'],
      'read:any': ['*'],
    },
  },
  [AppRoles.admin]: {
    orders: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    feedbacks: {
      'read': ['*'],
    },
    categories: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    items: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    promocodes: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    branches: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    'mailing-templates': {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    'bot-users': {
      'read:any': ['*'],
      'update:any': ['*'],
    },
    organizations: {
      'update:any': ['*'],
      'read:any': ['*'],
      'create:any': ['*'],
      'delete:any': ['*'],
    },
  }
};

export const roles: RolesBuilder = new RolesBuilder(grantsObject);