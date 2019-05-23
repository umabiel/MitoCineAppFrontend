import { VentaDTO } from './../../_model/ventaDTO';
import { DetalleVenta } from './../../_model/detalleVenta';
import { Venta } from './../../_model/venta';
import { DomSanitizer } from '@angular/platform-browser';
import { ComidaService } from './../../_service/comida.service';
import { Comida } from './../../_model/comida';
import { PeliculaService } from './../../_service/pelicula.service';
import { Cliente } from './../../_model/cliente';
import { ClienteService } from './../../_service/cliente.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Pelicula } from 'src/app/_model/pelicula';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/_service/config.service';
import { VentaService } from 'src/app/_service/venta.service';
import * as moment from 'moment';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  tercerFormGroup: FormGroup;

  hidden: number;
  clientes: Cliente[];
  peliculas: Pelicula[];
  asientos: number[] = [];
  comidas: Comida[];
  clienteSeleccionado: Cliente;  
  peliculaSeleccionada: Pelicula;
  asientosSeleccionados: number[] = [];
  comidasSeleccionadas: Comida[] = [];
  precioEntrada: number;
  precioTotal: number;
  
  constructor(private _formBuilder: FormBuilder, private clienteService : ClienteService, private peliculaService : PeliculaService, private comidaService : ComidaService, private sanitization: DomSanitizer, private configService : ConfigService, private ventaService : VentaService) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.tercerFormGroup = this._formBuilder.group({
      tercerCtrl: ['']
    });

    this.listarClientes();
    this.listarPeliculas();
    this.listarComidas();

    this.asientosSeleccionados = [];
    for (let i = 1; i <= 100; i++) {
      this.asientos.push(i);
    }

    this.configService.leerParametro(environment.PRECIO_ENTRADA).subscribe(data => {
      this.precioEntrada = +data.valor;
    });
  }

  seleccionarComida(e: any, c: Comida) {
    if (e.checked) {
      this.comidasSeleccionadas.push(c);
      this.precioTotal = this.precioTotal + c.precio;
    } else {
      this.precioTotal = this.precioTotal - c.precio;
    }
  }

  seleccionarPelicula(pelicula: Pelicula) {
    this.peliculaSeleccionada = pelicula;
  }

  listarPeliculas() {
    this.peliculaService.listar().subscribe(data => {
      this.peliculas = data;
    });
  }

  listarClientes() {
    this.clienteService.listar().subscribe(data => {
      this.clientes = data;
    });
  }

  listarComidas() {
    this.comidaService.listar().subscribe(data => {
      this.comidas = data;
      for (let c of this.comidas) {
        this.comidaService.listarPorId(c.idComida).subscribe(data => {

          let reader = new FileReader();
          reader.readAsDataURL(data);
          reader.onloadend = () => {
            let x = reader.result;
            c._foto = this.setear(x);
            c._isFoto = true;
          }
        });
      }
    });
  }

  setear(x: any) {
    return this.sanitization.bypassSecurityTrustResourceUrl(x);
  }


  seleccionarAsiento(asiento: number) {

    if (this.asientosSeleccionados.includes(asiento)) {
      //eliminando el asiento si ya esta seleccionado
      this.asientosSeleccionados.splice(this.asientosSeleccionados.indexOf(asiento), 1);
      //siempre guardo el tamaño de la lista de asientos seleccionados en un hidden
      this.hidden = this.asientosSeleccionados.length;
    } else {
      this.asientosSeleccionados.push(asiento);
      //siempre guardo el tamaño de la lista de asientos seleccionados en un hidden
      this.hidden = this.asientosSeleccionados.length;
    }
    this.precioTotal = this.precioEntrada * this.asientosSeleccionados.length;
  }

  verificar() {
    return !(this.asientosSeleccionados.length > 0 && this.clienteSeleccionado != null && this.peliculaSeleccionada != null);
  }

  registrar() {

    let venta = new Venta();
    venta.cliente = this.clienteSeleccionado;
    venta.fecha = moment().format('YYYY-MM-DDTHH:mm:ss');
    //https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
    /*var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    console.log(localISOTime);*/
    venta.cantidad = this.asientosSeleccionados.length;
    venta.pelicula = this.peliculaSeleccionada;
    venta.total = this.precioTotal;

    let detalles: DetalleVenta[] = [];
    for (let a of this.asientosSeleccionados) {
      let detalle = new DetalleVenta();
      detalle.asiento = a;
      detalles.push(detalle);
    }
    venta.detalle = detalles;

    let ventaDTO = new VentaDTO();
    ventaDTO.venta = venta;
    ventaDTO.lstComidas = this.comidasSeleccionadas;
    this.ventaService.registrar(ventaDTO).subscribe(data => {
      if (data === 1) {
        /*this.snackBar.open('Se registro', 'AVISO', {
          duration: 2000
        });*/
        //generar impresion
        this.generarReporte(ventaDTO);
        //this.limpiar();
      }
    });
  }

  generarReporte(ventaDTO: VentaDTO) {
    this.ventaService.generarReporte(ventaDTO).subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;')
      a.href = url;
      a.download = 'venta.pdf';
      a.click();
    });
  }

}
