import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../constants';
import { WebContentType } from '@app/domain/webContentType';

// Define or import ContentType interface
export interface ContentType {
  // Add properties as needed, for example:
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class NoticeTypesService {
  notificationTypes = httpResource<WebContentType[]>(() => ({
    url: Constants.GET_CONTENT_TYPES_URL,
  }));
  // httpResource(() => Constants.GET_CONTENT_TYPES_URL);
}
