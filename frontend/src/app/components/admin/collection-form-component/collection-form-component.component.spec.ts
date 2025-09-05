import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionFormComponentComponent } from './collection-form-component.component';

describe('CollectionFormComponentComponent', () => {
  let component: CollectionFormComponentComponent;
  let fixture: ComponentFixture<CollectionFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionFormComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
