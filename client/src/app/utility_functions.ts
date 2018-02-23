import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export function handleHTTPError(error: HttpErrorResponse) {
  console.error(error);
  let errorMessage = '';
  if (error instanceof Error) {
    // A client-side or network error occurred. Handle it accordingly.
    errorMessage = `An error occurred: ${error.message}`;
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
  }
  console.error(errorMessage);
  return Observable.throw(errorMessage);
}
