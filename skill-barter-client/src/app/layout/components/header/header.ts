import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../common/models/user.model';
import { AuthActions } from '../../../features/auth/state/auth.actions';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { selectCurrentUser } from '../../../features/user/state/user.selector';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserState } from '../../../features/user/state/user.state';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatToolbarModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    NgTemplateOutlet,
    MatFormFieldModule,
    AsyncPipe,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  user!: Observable<User | undefined>;

  constructor(private readonly store: Store<UserState>) {}

  ngOnInit(): void {
    this.user = this.store.select(selectCurrentUser);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
