import { ConsultaDialogoComponent } from './consulta-dialogo/consulta-dialogo.component';
import { FiltroConsultaDTO } from './../../_model/filtroConsultaDTO';
import { Venta } from './../../_model/venta';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { VentaService } from 'src/app/_service/venta.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  form: FormGroup;
  displayedColumns = ['cliente', 'pelicula', 'fecha', 'total', 'acciones'];
  dataSource: MatTableDataSource<Venta>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  maxFecha: Date = new Date();

  constructor(private ventaService: VentaService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      'dni': new FormControl(''),
      'nombreCompleto': new FormControl(''),
      'fechaConsulta': new FormControl()
    });
  }

  buscar() {
    let filtro = new FiltroConsultaDTO(this.form.value['dni'], this.form.value['nombreCompleto'], this.form.value['fechaConsulta']);
    filtro.nombreCompleto = filtro.nombreCompleto.toLocaleLowerCase();

    if (filtro.fechaConsulta) {
      filtro.fechaConsulta.setHours(0);
      filtro.fechaConsulta.setMinutes(0);
      filtro.fechaConsulta.setSeconds(0);
      filtro.fechaConsulta.setMilliseconds(0);

      delete filtro.dni;
      delete filtro.nombreCompleto;      

      this.ventaService.buscar(filtro).subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      });
    } else {
      delete filtro.fechaConsulta;

      if (filtro.dni.length === 0) {
        delete filtro.dni;
      }

      if (filtro.nombreCompleto.length === 0) {
        delete filtro.nombreCompleto
      }      
      
      this.ventaService.buscar(filtro).subscribe(data => {        
        this.dataSource = new MatTableDataSource(data)
      });
    }

  }

  verDetalle(venta: Venta) {  
    this.dialog.open(ConsultaDialogoComponent, {
      data: venta
    });
  }


}
