import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TasksRoutingModule} from './tasks-routing.module';

import {TasksComponent} from './tasks.component';
import {TaskComponent} from './task/task.component';

import {ApiService} from '../shared/services/api.service';

@NgModule({
  declarations: [TasksComponent, TaskComponent],
  imports: [
    CommonModule,
    TasksRoutingModule
  ],
  providers: [ApiService],
})
export class TasksModule {
}

