import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShowPostsComponent} from "./show-posts/show-posts.component";
import {SettingComponent} from './setting/setting.component';
import {ProfileComponent} from "./profile/profile.component";
import {PostDetailComponent} from './post-detail/post-detail.component';
import {ForShowPostComponent} from "./models/for-show-post-component.enum";
import {EditorComponent} from './editor/editor.component';
import {AuthGuard} from "./guards/auth.guard";
import {SubscriberListComponent} from "./subscriber-list/subscriber-list.component";
import {NotfoundComponent} from "./notfound/notfound.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ShowPostsComponent,
    data: {
      content: ForShowPostComponent.MAIN
    }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: {
      profile: true
    }
  },
  {
    path: 'subscriber',
    component: SubscriberListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/setting',
    canActivate: [AuthGuard],
    component: SettingComponent,
  },
  {
    path: 'user/:id',
    component: ProfileComponent,
  },
  {
    path: 'favourites',
    canActivate: [AuthGuard],
    component: ShowPostsComponent,
    data: {
      content: ForShowPostComponent.FAVOURITES
    }
  },
  {
    path: 'post/:id',
    component: PostDetailComponent,
  },
  {
    path: 'create',
    canActivate: [AuthGuard],
    component: EditorComponent
  },
  {
    path: 'search',
    component: ShowPostsComponent,
    data: {
      content: ForShowPostComponent.SEARCH
    }
  },
  {
    path: 'find/tag/:id',
    component: ShowPostsComponent,
    data: {
      content: ForShowPostComponent.TAG
    }
  },
  {
    path: '**',
    component: NotfoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
