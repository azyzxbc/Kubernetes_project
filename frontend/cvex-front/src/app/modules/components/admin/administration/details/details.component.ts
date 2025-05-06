import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';

@Component({
    selector: 'contacts-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,

})
export class ContactsDetailsComponent implements OnInit {
    @ViewChild('drawer1') drawer1!: MatDrawer;
    @ViewChild('drawer2') drawer2!: MatDrawer;

    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
    closeDrawer(drawerNumber: number): void {
        if (drawerNumber === 1) {
            this.drawer1.close();
        } else if (drawerNumber === 2) {
            this.drawer2.close();
        }
    }
}
