import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DomainesComponent} from './login.component';

describe('DomainesComponent', () => {
    let component: DomainesComponent;
    let fixture: ComponentFixture<DomainesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DomainesComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DomainesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
