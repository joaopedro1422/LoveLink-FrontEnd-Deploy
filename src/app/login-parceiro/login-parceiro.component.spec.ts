import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginParceiroComponent } from './login-parceiro.component';

describe('LoginParceiroComponent', () => {
  let component: LoginParceiroComponent;
  let fixture: ComponentFixture<LoginParceiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginParceiroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginParceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
