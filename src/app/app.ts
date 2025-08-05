import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private _router: Router = inject(Router);
  constructor() {
    const token = localStorage.getItem('token');
    if (!token)
      this._router.navigate(['/login']);
  }
  protected readonly title = signal('FicharioDigital');

}
