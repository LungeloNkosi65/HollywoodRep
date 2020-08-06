import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { Country } from './iCountry';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './services/error-handler.service';
@Injectable({
  providedIn: 'root'
})
export class CountryService {


  private countryUrl = 'https://localhost:44365/api/countries/';
  private param="GetSportCountry?sportId="
  clicked: boolean = false;
  constructor(private _http: HttpClient, private errorHandler:ErrorHandlerService) { }

  getCountries(id: number): Observable<Country[]> {
    return this._http.get<Country[]>(this.countryUrl + id)
    .pipe(catchError(this.errorHandler.handleError));
  }
  

  getCountriesBasedOnSport(sportId:number):Observable<Country[]>{
      return this._http.get<Country[]>(`${this.countryUrl}${this.param}${sportId}`)
      .pipe(catchError(this.errorHandler.handleError));
  }
}
