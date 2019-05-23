import { Genero } from './../_model/genero';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  generoCambio = new Subject<Genero[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST_URL}/generos`;

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Genero[]>(this.url);
  }

  listarPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`); //&sort=nombre
  }

  listarPorId(genero: Genero) {
    return this.http.get<Genero>(`${this.url}/${genero.idGenero}`);
  }

  registrar(genero: Genero) {
    return this.http.post(this.url, genero);
  }

  modificar(genero: Genero) {
    return this.http.put(this.url, genero);
  }

  eliminar(genero: Genero) {
    return this.http.delete(`${this.url}/${genero.idGenero}`);
  }
}
