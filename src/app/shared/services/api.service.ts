import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ApiService {
  serverAddress: string = 'https://anking.ru';
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Accept': 'application/json'
    })
  }

  constructor(
    private httpClient: HttpClient
  ) {
  }

  private static handleError(error: HttpErrorResponse) {
    return throwError(error); //'Something get wrong'
  };

  getTask(id) {
    return this.httpClient
      .get(this.serverAddress + '/api.php?task='+id, this.httpOptions)
      .pipe(catchError(ApiService.handleError))
  }


}
