import { Injectable } from '@angular/core';
import { Tournament } from './iToutnament';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './services/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class TournamentsService {

  tournaments: Tournament[];
  private tournamentUrl = 'https://localhost:44365/api/Tournaments';
  private _sportId = 'sportId=';
  private _countryId = 'countryId=';
  private param = '/TournamentForSport?';
  finalTournamentsList: any[] = [];

  constructor(private _http: HttpClient,private errorHandlerService:ErrorHandlerService) { }

  getTournaments(sportId: number, countryId: number): Observable<Tournament[]> {
    return this._http.get<Tournament[]>(`${this.tournamentUrl}${this.param}${this._sportId}${sportId}&${this._countryId}${countryId}`)
      .pipe(catchError(this.errorHandlerService.handleError));
  }


  addToTournamentsList(tournaments: any) {
    //TODO MAKE THIS BETTER
    if (this.checkIfExists(tournaments) == false) {

      this.finalTournamentsList.push(tournaments);
    }
    else {
      return;
    }

  }

  removeTournament(index: number) {
    this.finalTournamentsList.splice(this.finalTournamentsList.indexOf(index), 1)
  }

  checkIfExists(tournament: any): boolean {
    for (let index = 0; index < this.finalTournamentsList.length; index++) {
      const element = this.finalTournamentsList[index]
      console.log('id already in array', element.country.CountryId);
      console.log('new id', tournament.country.CountryId);
      if (element.country.CountryId == tournament.country.CountryId) {
        console.log('true');
        return true;
      }

    }
    console.log('false');
    return false;
  }
}
