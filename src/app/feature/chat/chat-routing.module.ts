import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { ChatComponent } from './chat.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { CheckProfileStatusGuard } from 'src/app/component/check-profile-status.guard';

const routes: Routes = [
  {
    path: '',
    component:ChatComponent
  },{
    path:':chat_rome_id',
    canActivate:[CheckProfileStatusGuard],
    component:ChatRoomComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
