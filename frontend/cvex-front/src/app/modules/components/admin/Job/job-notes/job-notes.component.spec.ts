import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobNotesComponent } from './job-notes.component';

describe('JobNotesComponent', () => {
  let component: JobNotesComponent;
  let fixture: ComponentFixture<JobNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobNotesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
