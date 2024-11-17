import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCollectorFormComponent } from './data-collector-form.component';

describe('DataCollectorFormComponent', () => {
  let component: DataCollectorFormComponent;
  let fixture: ComponentFixture<DataCollectorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataCollectorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataCollectorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
