import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { REG_EX } from '../../../../common/constants/reg-ex.const';
import {
  IMAGES_URL,
  UPLOAD_IMAGE_DEFAULT,
  UPLOAD_IMAGES_URL,
} from '../../../../common/constants/upload-image.consts';
import { ImageType } from '../../../../common/enums/image-type.enum';
import { Store } from '@ngrx/store';
import { UserState } from '../../state/user.state';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { UserActions } from '../../state/user.actions';
import { filter } from 'rxjs';
import { User } from '../../../../common/models/user.model';
import { selectCurrentUser } from '../../state/user.selectors';
import { USERNAME_LENGTH } from '../../../../common/constants/username-length.const';

@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    FlexLayoutModule,
    FileUploadModule,
    AvatarModule,
    AvatarGroupModule,
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
  user: User;
  editedUser: Partial<User> = {};

  hidePassword = signal<boolean>(true);
  hideConfirmPassword = signal<boolean>(true);

  uploadedImage: string;

  readonly USERNAME_MIN_LENGTH = USERNAME_LENGTH.MIN;
  readonly USERNAME_MAX_LENGTH = USERNAME_LENGTH.MAX;
  readonly PASSWORD_PATTERN: string = REG_EX.PASSWORD.source;
  readonly UPLOAD_IMAGES_URL = UPLOAD_IMAGES_URL + ImageType.PROFILE_PICTURE;
  readonly AVATAR_STYLE = {
    width: '150px',
    height: '150px',
    border: '5px solid #0044cc',
  };

  private store = inject(Store<UserState>);

  ngOnInit(): void {
    this.store
      .select(selectCurrentUser)
      .pipe(filter((user) => !!user))
      .subscribe((user) => {
        this.user = user;

        this.editedUser = {
          username: user.username,
          email: user.email,
        };
        this.uploadedImage = user.profilePicture ?? '';
      });
  }

  onSelectProfilePicture(fileUpload: FileUpload) {
    fileUpload.upload();
  }

  onUploadProfilePicture(event: any) {
    this.uploadedImage = event.originalEvent.body[0];
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const { confirmPassword, email, username, password } = form.value;

    if (password) {
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
    }

    const updateUserDto: UpdateUserDto = {
      ...(email && email !== '' && email !== this.user.email && { email }),
      ...(username && username !== '' && username !== this.user.username && { username }),
      ...(password && password !== '' && { password }),
      ...(this.uploadedImage &&
        this.uploadedImage !== '' &&
        this.uploadedImage !== this.user.profilePicture && { profilePicture: this.uploadedImage }),
    };

    this.store.dispatch(UserActions.updateProfile({ updateUserDto }));
  }

  formatImage(imgPath: string | undefined) {
    if (imgPath) {
      return IMAGES_URL + `/${ImageType.PROFILE_PICTURE}/` + imgPath;
    } else {
      return UPLOAD_IMAGE_DEFAULT.USER.IMAGE;
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
