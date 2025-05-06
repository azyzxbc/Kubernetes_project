import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PlusDetailsComponent} from './interview.component';

describe('PlusDetailsComponent', () => {
    let component: PlusDetailsComponent;
    let fixture: ComponentFixture<PlusDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlusDetailsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PlusDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
