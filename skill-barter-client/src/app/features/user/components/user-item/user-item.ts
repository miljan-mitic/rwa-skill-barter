import { Component, Input } from '@angular/core';
import { User } from '../../../../common/models/user.model';
import { DATE_FORMAT } from '../../../../common/constants/date-format.const';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { IMAGES_URL, UPLOAD_IMAGE_DEFAULT } from '../../../../common/constants/upload-image.consts';
import { ImageType } from '../../../../common/enums/image-type.enum';

@Component({
  selector: 'app-user-item',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    FlexLayoutModule,
    AvatarModule,
    DatePipe,
    DecimalPipe,
  ],
  templateUrl: './user-item.html',
  styleUrl: './user-item.scss',
})
export class UserItem {
  @Input({ required: true }) user: User;

  dateFormat = DATE_FORMAT.DEFAULT;

  readonly AVATAR_STYLE = {
    width: '80px',
    height: '80px',
    border: '5px solid red',
  };

  formatImage(imgPath: string | undefined) {
    if (imgPath) {
      return IMAGES_URL + `/${ImageType.PROFILE_PICTURE}/` + imgPath;
    } else {
      return UPLOAD_IMAGE_DEFAULT.USER.IMAGE;
    }
  }
}
