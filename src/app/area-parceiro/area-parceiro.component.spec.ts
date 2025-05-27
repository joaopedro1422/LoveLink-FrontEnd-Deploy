import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaParceiroComponent } from './area-parceiro.component';

describe('AreaParceiroComponent', () => {
  let component: AreaParceiroComponent;
  let fixture: ComponentFixture<AreaParceiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaParceiroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaParceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
