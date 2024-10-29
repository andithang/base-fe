import { Component, Inject, OnInit } from '@angular/core';
import { ModuleConfig, ModuleInjectionToken } from '../../data-access/module-config';

@Component({
    selector: 'test',
    template: '<div>test</div>',
    standalone: true
})

export class TestComponent implements OnInit {
    constructor(
        @Inject(ModuleInjectionToken) private moduleConfig: ModuleConfig
    ) { }

    ngOnInit() { 
        console.log(this.moduleConfig);
    }
}