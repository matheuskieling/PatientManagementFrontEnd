import { Component, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-button-with-icon',
  imports: [
    NzButtonComponent,
    NzIconDirective
  ],
  templateUrl: './button-with-icon.html',
  styleUrl: './button-with-icon.scss'
})
export class ButtonWithIcon {
  @Input() text: string = '';
  @Input() variant: 'primary'|'dashed'|'link'|'text'|null = null;
  @Input() icon: string = '';
}
