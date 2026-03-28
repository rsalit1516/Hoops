import { FormGroup } from '@angular/forms';

export interface BaseFormConfig<T> {
  buildForm(item?: T): FormGroup;
  mapToModel(formValue: any): T;
}
