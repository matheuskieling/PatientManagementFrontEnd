import { Component, Input } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-nav-link',
  imports: [
    NzIconDirective,
    NgClass
  ],
  templateUrl: './nav-link.html',
  styleUrl: './nav-link.scss'
})
export class NavLink {
  @Input() icon: string = '';
  @Input() isActive: boolean = false;
}
