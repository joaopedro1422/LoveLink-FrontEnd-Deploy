import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastraPaginaParceiroComponent } from './cadastra-pagina-parceiro.component';

describe('CadastraPaginaParceiroComponent', () => {
  let component: CadastraPaginaParceiroComponent;
  let fixture: ComponentFixture<CadastraPaginaParceiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastraPaginaParceiroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastraPaginaParceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
