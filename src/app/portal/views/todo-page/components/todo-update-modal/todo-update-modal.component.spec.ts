import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoUpdateModalComponent } from './todo-update-modal.component';

describe('TodoUpdateModalComponent', () => {
  let component: TodoUpdateModalComponent;
  let fixture: ComponentFixture<TodoUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoUpdateModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
