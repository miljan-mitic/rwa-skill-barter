import { environment } from '../../../environments/environment';

export const DEFAULT = {
  USER: {
    IMAGE: '/images/default-user.jpg',
  },
};

export const IMAGES_URL = `${environment.api}/file/image`;
export const UPLOAD_IMAGES_URL = `${environment.api}/file/uploadImages/`;
