import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'dashboard/dashboardFrom/:formgroup',
    loadChildren: () => import('./dashbordForm/dashboardForm.module').then((m) =>m.DashboardFormModule),
  },
  {
    path: 'builder',
    loadChildren: () => import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'dreamboard',
    loadChildren:() => import('./dreamboard/dreamboard.module').then((m) =>m.DreamboardModule),
  },
  {
    path: 'view-dreamboard/:id/:formId',
    loadChildren:() => import('./dream-id/dream-id.module').then((m) =>m.DreamIdModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () => import('../modules/profile/profile.module').then((m) => m.ProfileModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'crafted/account',
    loadChildren: () => import('../modules/account/account.module').then((m) => m.AccountModule),
    // data: { layout: 'dark-header' },
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () => import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
    // data: { layout: 'light-header' },
  },
  {
    path: 'crafted/widgets',
    loadChildren: () => import('../modules/widgets-examples/widgets-examples.module').then((m) => m.WidgetsExamplesModule),
    // data: { layout: 'light-header' },
  },
  {
    path: 'apps/chat',
    loadChildren: () => import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'apps/users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'apps/roles',
    loadChildren: () => import('./role/role.module').then((m) => m.RoleModule),
  },
  {
    path: 'apps/permissions',
    loadChildren: () => import('./permission/permission.module').then((m) => m.PermissionModule),
  },
  {
    path: 'escalation',
    loadChildren: () => import('./escalation/escalation.module').then((m) => m.EscalationModule),
  },
  {
    path: 'client',
    loadChildren: () => import('./client/client.module').then((m) => m.ClientModule),
  },

  {
    path: 'manage-user',
    loadChildren: () => import('./user-management/user-management.module').then((m) => m.UserManagementModule),
  },

  {
    path: 'company',
    loadChildren: () => import('./company/company.module').then((m) => m.CompanyModule),
  },


  // {
  //   path: 'permission',
  //   loadChildren: () => import('./permission2/permission2.module').then((m) => m.Permission2Module),
  // },
  {
    path: 'permission',
    loadChildren: () => import('./permission3/permission3.module').then((m) => m.Permission3Module),
  },
  {
    path: 'location-management',
    loadChildren: () => import('./location-management/location-management.module').then((m) => m.LocationManagementModule),
  },

  {
    path: 'summary-engine',
    loadChildren: () => import('./summary-engine/summary-engine.module').then((m) => m.SummaryEngineModule),
  },
  {
    path: 'connection',
    loadChildren: () => import('./connection-settings/connection-settings.module').then((m) => m.ConnectionModule),
  },
  {
    path: 'formgroup',
    loadChildren: () => import('./Formgroup/formgroup.module').then((m) => m.FormgroupModule),
  },

  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };