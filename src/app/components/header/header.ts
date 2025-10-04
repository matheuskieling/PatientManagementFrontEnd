import { Component } from '@angular/core';
import { NavLink } from '../nav-link/nav-link';
import { Router } from '@angular/router';
import { APP_NAME } from '../../../constants';

@Component({
  selector: 'app-header',
  imports: [
    NavLink
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  constructor(private router: Router) {}

  getPath() {
    return this.router.url;
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

  protected readonly APP_NAME = APP_NAME;
}
