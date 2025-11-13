import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(private router: Router) {}

  navigateToCitizenPortal() {
    this.router.navigate(['/citizen-portal']);
  }

  navigateToAdminPortal() {
    // TODO: Navigate to admin portal when route is created
    // this.router.navigate(['/admin']);
    console.log('Navigate to Admin Portal');
  }

}
