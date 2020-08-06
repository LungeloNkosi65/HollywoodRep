import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  handleError(error: HttpErrorResponse) {
    console.log('Error status ', error.error);
    if (error.status == 404) {
      console.log(error);
      return of([]);
    }
    else if (error.status == 200) {
      return of([{ status: "" }]);
    }
    else {
      console.log(error);
      return of([{ status: "an error occured", error }])
        ;
    }

  }
}
