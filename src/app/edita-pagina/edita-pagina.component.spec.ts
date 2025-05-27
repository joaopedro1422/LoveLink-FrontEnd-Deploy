import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditaPaginaComponent } from './edita-pagina.component';

describe('EditaPaginaComponent', () => {
  let component: EditaPaginaComponent;
  let fixture: ComponentFixture<EditaPaginaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditaPaginaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditaPaginaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
