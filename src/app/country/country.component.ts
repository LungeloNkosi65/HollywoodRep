import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Country } from '../iCountry';
import { CountryService } from '../country.service';
import { ActivatedRoute } from '@angular/router';
import { Location, NumberSymbol } from '@angular/common';
import { Router } from '@angular/router';
import { Tournament } from '../iToutnament';
import { TournamentsService } from '../tournaments.service';
import { CountryTournamentAssociation } from '../Models/ITournamentsAssociation';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  countries: Country[];
  sportId: number;
  sportName:string;
  selectCountry: any;
  tournaments: Tournament[];
  tornamentsArray: CountryTournamentAssociation;
  tData: CountryTournamentAssociation[] = [];

  constructor(private _countryService: CountryService,
    private route: ActivatedRoute, private router: Router,
    private tournamentService: TournamentsService) { }

  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      this.resertList();
      this.getCountries();
    });
  }


  getCountries() {
    var sportId = +this.route.snapshot.paramMap.get('sportId');
    this.sportId = sportId;
    this.getSportName();
    return this._countryService.getCountriesBasedOnSport(sportId).subscribe((data: any) => {
      this.countries = data;
    });
  }

  onClick(): void {
    this._countryService.clicked = true;
  }

  ngDoCheck(): void {
    if (this._countryService.clicked) {
      this.getCountries();
      this._countryService.clicked = false;
    }
  }


  selectedCountry(countryId: number) {   //this will get the tournaments from the api using the countryId and sportId
    this.tournamentService.getTournaments(this.getSportId(), countryId).subscribe((data: any) => {
      this.tournaments = data;
      this.addToList(this.selectCountry, data);
    });
    console.log('tournaments array', this.tData)
  }


  addToList(country: any, tournament: Tournament[]) {
    //after getting the tournaments pass the to the tournaments array
    this.tornamentsArray = {
      id: this.tData.length + 1,  // so that the id will never be duplicate
      country: country,
      tournaments: tournament
    };
    this.tournamentService.addToTournamentsList(this.tornamentsArray);
    this.tData = this.tournamentService.finalTournamentsList;

    
  }

  resertList() {
    this.tData=[];
     this.tournamentService.finalTournamentsList=[];
  }

  getSportId() {
    return +this.route.snapshot.paramMap.get('sportId');
  }

  getSportName(){
    this.sportName =this.route.snapshot.paramMap.get('sportName');
  }

  onSelect(data: any) //this will passs the selected country value to the tournamen component(child)
  {
    this.selectCountry = data;
  }


  removeTournamen(index: number) {
    this.tournamentService.removeTournament(index);
    console.log('push me to gihub');
  }

  showEvents(tournamentId: number,tournamentName:string) //this will navigate to events
  {
    this.router.navigateByUrl(`betting/${this.sportId}/${this.sportName}/tournament/${tournamentId}/${tournamentName}`);
  }
     
}
