import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-document-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `<section class="container-fluid">
    <h2>Documents</h2>
    <router-outlet />
  </section>`,
})
export class AdminDocumentShell {}
