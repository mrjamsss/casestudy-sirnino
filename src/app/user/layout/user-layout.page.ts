import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../shared/services/sidebar.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.page.html',
  styleUrls: ['./user-layout.page.scss'],
  standalone: false
})
export class UserLayoutPage implements OnInit {

  constructor(public sidebarService: SidebarService) { }

  ngOnInit() {
  }

}
