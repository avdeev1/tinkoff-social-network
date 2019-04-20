import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent} from './app.component';
import {EditorComponent} from './editor/editor.component';

import {ShowPostsComponent} from './show-posts/show-posts.component';
import {ProfileHeaderComponent} from './profile-header/profile-header.component';
import {SettingComponent} from './setting/setting.component';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ShowPostsComponent,
    data: {}
  },
  {
    path: 'profile',
    component: ProfileHeaderComponent,
    pathMatch: 'full',
  },
  {
    path: 'profile/draft',
    pathMatch: 'full',
    component: ShowPostsComponent,
  },
  {
    path: 'profile/setting',
    component: SettingComponent,
    pathMatch: 'full',
  },
  {
    path: 'user/:login',
    component: ProfileHeaderComponent,
    pathMatch: 'full',
  },
  {
    path: 'favorites',
    component: ShowPostsComponent,
    data: {}
  },
  {
    path: 'post/:id',
    component: ShowPostsComponent,
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: EditorComponent,
    pathMatch: 'full',
  },
  {
    path: 'search/:searchWord',
    component: ShowPostsComponent,
    data: {}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
