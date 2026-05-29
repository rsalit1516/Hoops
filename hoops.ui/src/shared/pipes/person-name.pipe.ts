import { Pipe, PipeTransform } from '@angular/core';
import { formatPersonName } from '@app/shared/utils/person.utils';

@Pipe({
  name: 'personName',
})
export class PersonNamePipe implements PipeTransform {
  transform(person: { lastName: string; firstName: string }): string {
    return formatPersonName(person);
  }
}
