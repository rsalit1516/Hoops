import { Component } from '@angular/core';
import { PersonalInfoComponent } from "../../components/personal-info/personal-info.component";

@Component({
  selector: 'app-admin-people-shell',
  imports: [PersonalInfoComponent],
  templateUrl: './admin-people-shell.component.html',
  styleUrls: [ './admin-people-shell.component.scss',
    '../../admin.component.scss',

  ]
})
export class AdminPeopleShellComponent {

}
