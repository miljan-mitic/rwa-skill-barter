import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthState } from '../../state/auth.state';
import { AuthActions } from '../../state/auth.actions';
import { REG_EX } from '../../../../common/constants/reg-ex.const';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import {
  IMAGES_URL,
  UPLOAD_IMAGES_URL,
  DEFAULT,
} from '../../../../common/constants/upload-image.consts';
import { ImageType } from '../../../../common/enums/image-type.enum';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { SignupAuthDto } from '../../dtos/signup-auth.dto';

@Component({
  selector: 'app-signup',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatIconModule,
    FileUploadModule,
    AvatarModule,
    AvatarGroupModule,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  uploadedImage!: string;

  readonly USERNAME_MIN_LENGTH = 6;
  readonly PASSWORD_PATTERN: string = REG_EX.PASSWORD.source;
  readonly UPLOAD_IMAGES_URL = UPLOAD_IMAGES_URL + ImageType.PROFILE_PICTURE;
  readonly AVATAR_STYLE = {
    width: '150px',
    height: '150px',
    border: '5px solid #0044cc',
  };

  constructor(private readonly store: Store<AuthState>) {}

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

    const { confirmPassword, ...data } = form.value();
    const signupAuthDto: SignupAuthDto = { ...data, profilePicture: this.uploadedImage };

    if (signupAuthDto.password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    this.store.dispatch(AuthActions.signup({ signupAuthDto }));
  }

  formatImage(imgPath: string | undefined) {
    if (imgPath) {
      return IMAGES_URL + `/${ImageType.PROFILE_PICTURE}/` + imgPath;
    } else {
      return DEFAULT.USER.IMAGE;
    }
  }
}
