import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilDialogoComponent } from './perfil-dialogo.component';

describe('PerfilDialogoComponent', () => {
  let component: PerfilDialogoComponent;
  let fixture: ComponentFixture<PerfilDialogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilDialogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilDialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
