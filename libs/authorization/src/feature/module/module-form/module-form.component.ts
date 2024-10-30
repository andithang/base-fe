import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServerUrlInjection, ModuleConfig } from 'libs/authorization/src/data-access/module-config';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'app-module-form',
  templateUrl: './module-form.component.html',
  styleUrls: ['./module-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule, NzButtonModule, NzIconModule,
    NzSwitchModule, FormsModule
  ]
})
export class ModuleFormComponent implements OnInit {

  constructor(
    @Inject(ServerUrlInjection) private moduleConfig: ModuleConfig,
    private _modalRef: NzModalRef
  ) { }

  ngOnInit() {
  }

  @Input() title?: string;
  @Input() subtitle?: string;

  destroyModal(): void {
    this._modalRef.destroy();
  }

}
