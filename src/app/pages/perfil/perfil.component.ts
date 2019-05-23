import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PerfilDialogoComponent } from './perfil-dialogo/perfil-dialogo.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog() {
    this.dialog.open(PerfilDialogoComponent, {
      width: '350px',
      data: null
    });
  }

}
