import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { TranslocoService } from '@ngneat/transloco';
import { UserProfile } from 'app/modules/models/User.model';
import { UserService } from 'app/core/user/user.service';
@Component({
    selector: 'classy-layout',
    templateUrl: './classy.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    userProfile: UserProfile | null = {};
    firstLetter: string = '';
    profileImage: string | null;
    navigationAppearance: 'default' | 'classy' = 'classy';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _navigationService: NavigationService,
        private _fuseNavigationService: FuseNavigationService,
        private translocoService: TranslocoService,
        public userServices: UserService
    ) {
        this.userProfile = this.userServices.userProfile;
    }

    get currentYear(): number {
        return new Date().getFullYear();
    }
    ngOnInit(): void {
       
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                navigation.default.forEach((item) => {
                    this.translocoService.selectTranslate(item.title);
                });
                this.navigation = navigation;
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        // @ts-ignore
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                name
            );

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
