import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/services/auth.service';

@NgModule({
    exports: [],
    imports: [CommonModule],
    providers: [AuthService]
})
export class UserModule {}
