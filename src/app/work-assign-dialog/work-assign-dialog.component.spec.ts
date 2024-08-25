import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAssignDialogComponent } from './work-assign-dialog.component';

describe('WorkAssignDialogComponent', () => {
  let component: WorkAssignDialogComponent;
  let fixture: ComponentFixture<WorkAssignDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkAssignDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkAssignDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
