import { Component } from '@angular/core';
import { ContactsComponent } from '../contacts/contacts.component';

@Component({
  selector: 'csbc-dashboard',
  templateUrl: './csbc-dashboard.component.html',
  styleUrls: ['./csbc-dashboard.component.css']
})
export class CsbcDashboardComponent {
  cards = [
    { title: 'Card 1', cols: 2, rows: 1, content: ContactsComponent },
    { title: 'Test of another card', cols: 1, rows: 1, content: 'Content 4' },
    { title: 'Card 3', cols: 1, rows: 2, content: 'Content 3' },
    { title: 'Card 4', cols: 1, rows: 1, content: 'Content 4' }
  ];
}
