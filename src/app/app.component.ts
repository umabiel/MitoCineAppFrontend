import { Menu } from './_model/menu';
import { Component, OnInit } from '@angular/core';
import { LoginService } from './_service/login.service';
import { MenuService } from './_service/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  menus: Menu[]

  constructor(public loginService: LoginService, private menuService: MenuService) {

  }

  ngOnInit() {
    this.menuService.menuCambio.subscribe(data => {
      this.menus = data;
    });
  }

}
