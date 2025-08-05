import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-space',
  imports: [],
  templateUrl: './space.html',
  styleUrl: './space.scss'
})
export class Space {
  @Input() height: string = '';
}
