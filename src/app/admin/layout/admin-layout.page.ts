import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../shared/services/sidebar.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.page.html',
  styleUrls: ['./admin-layout.page.scss'],
  standalone: false
})
export class AdminLayoutPage implements OnInit {

  constructor(public sidebarService: SidebarService) { }

  ngOnInit() {
  }

}
