import {NgModule, Optional, SkipSelf} from '@angular/core';
import {IconsModule} from 'app/core/icons/icons.module';
import {TranslocoCoreModule} from 'app/core/transloco/transloco.module';

@NgModule({
    imports: [
        IconsModule,
        TranslocoCoreModule
    ]
})
export class CoreModule {

    constructor(
        @Optional() @SkipSelf() parentModule?: CoreModule
    ) {
        if (parentModule) {
            throw new Error('CoreModule has already been loaded. Import this module in the AppModule only.');
        }
    }
}
