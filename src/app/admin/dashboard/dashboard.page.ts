import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {
  logo: string | null = null;

  constructor() { }

  ngOnInit() {
    this.loadLogo();
  }

  ionViewWillEnter() {
    this.loadLogo();
  }

  loadLogo() {
    this.logo = localStorage.getItem('cityHallLogo');
  }

}
