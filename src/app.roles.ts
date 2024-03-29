import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
  operator = 'operator',
  manager = 'manager',
  owner = 'owner',
  admin = 'admin'
}

const grantsObject = {
  [AppRoles.operator]: {
    profile: {
      'read:any': ['*'],
      'update:any': ['*'],
    },
    orders: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    feedbacks: {
      'read:any': ['*'],
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
      'read:any': ['*', '!bot.*'],
    },
    users: {
      'read:any': ['*'],
    },
  },
  [AppRoles.manager]: {
    profile: {
      'read:any': ['*'],
      'update:any': ['*'],
    },
    orders: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    feedbacks: {
      'read:any': ['*'],
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
      'read:any': ['*'],
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
      'read:any': ['*', '!bot.*'],
    },
    users: {
      'read:any': ['*'],
      'create:any': ['*'],
      'update:any': ['*'],
    },
    analytics: {
      'read:any': ['*'],
    }
  },
  [AppRoles.owner]: {
    profile: {
      'read:any': ['*'],
      'update:any': ['*'],
    },
    orders: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    feedbacks: {
      'read:any': ['*'],
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
    users: {
      'read:any': ['*'],
      'create:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    analytics: {
      'read:any': ['*'],
    }
  },
  [AppRoles.admin]: {
    profile: {
      'read:any': ['*'],
      'update:any': ['*'],
    },
    orders: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    feedbacks: {
      'read:any': ['*'],
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
    users: {
      'read:any': ['*'],
      'create:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    analytics: {
      'read:any': ['*'],
    }
  }
};

export const roles: RolesBuilder = new RolesBuilder(grantsObject);