import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthState } from '../../store/auth.state';
import { AuthActions } from '../../store/auth.actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginAuthDto } from '../../dtos/login-auth.dto';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    FormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  hidePassword = signal<boolean>(true);

  constructor(private store: Store<AuthState>) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const loginAuthDto: LoginAuthDto = form.value;
      this.store.dispatch(AuthActions.login({ loginAuthDto }));
    }
  }

  toogleVisibilityPassword(hideSignal: WritableSignal<boolean>) {
    hideSignal.update((v) => !v);
  }

  resetVisibilityPasswordIfEmpty(value: string, hideSignal: WritableSignal<boolean>) {
    if (!value) {
      hideSignal.set(true);
    }
  }
}
