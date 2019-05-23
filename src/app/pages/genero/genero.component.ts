import { Genero } from './../../_model/genero';
import { GeneroService } from './../../_service/genero.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { GeneroDialogoComponent } from './genero-dialogo/genero-dialogo.component';

@Component({
  selector: 'app-genero',
  templateUrl: './genero.component.html',
  styleUrls: ['./genero.component.css']
})
export class GeneroComponent implements OnInit {

  dataSource: MatTableDataSource<Genero>;
  displayedColumns: string[] = ['idGenero', 'nombre', 'acciones'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cantidad: number = 0;

  constructor(private generoService: GeneroService, private dialog: MatDialog, private snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.generoService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource<Genero>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.generoService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'INFO', {
        duration: 2000
      });
    });

    this.generoService.generoCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource<Genero>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  filter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDialog(genero?: Genero) {
    let gen = genero != null ? genero : new Genero();
    this.dialog.open(GeneroDialogoComponent, {
      data: gen,
      width: '250px'
    });
  }

  eliminar(gen: Genero) {
    this.generoService.eliminar(gen).subscribe(() => {
      this.generoService.listar().subscribe(data => {
        this.generoService.generoCambio.next(data);
        this.generoService.mensajeCambio.next('SE ELIMINO');
      });
    });    
  }

  mostrarMas(e : any){    
    //console.log(e);
    this.generoService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      //console.log(data);

      let generos = data.content;
      this.cantidad = data.totalElements;
      
      this.dataSource = new MatTableDataSource(generos);
      //this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
