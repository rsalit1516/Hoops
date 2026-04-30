import { Component } from '@angular/core';
import { SponsorList } from '../../components/sponsor-list/sponsor-list';

@Component({
  selector: 'sponsor-shell',
  template: '<sponsor-list />',
  standalone: true,
  imports: [SponsorList],
})
export class SponsorShell {}
