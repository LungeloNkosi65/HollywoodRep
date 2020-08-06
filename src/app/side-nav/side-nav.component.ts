import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {SportsService} from '../sports.service';
import { Sport } from '../iSports';
import {CountryService} from '../country.service';
import {Store,State} from '@ngrx/store';
import * as SportActions from '../store/actions/sport.action';
import {AppState} from '../store/app.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  private jsonUrl="https://localhost:44365/api/sports";
  sportBets: Sport[];
  sport:string;
  sports$:Observable<Sport[]>;

  constructor(private _sportService:SportsService, private router:Router,
    private _countryService:CountryService,
    private store:Store<AppState>) {
      store.select(state=>state.sport).subscribe((data:any)=>{
        this.sports$=data;
      })
    
   }
  ngOnInit(): void {
    // this.getSport();
    this.store.dispatch(new SportActions.GetSport);

  }
  testState(){
    console.log(this.sports$);
  }

  onClick() :void{
    this._countryService.clicked=true;
  }

  removeSpaceFromSportType(sportName:string)
  {
    return sportName.trim().replace(' ','-').toLocaleLowerCase();
  }

  getSport(){
    this._sportService.getSports().subscribe((data:any)=>{
      this.sportBets=data;
      console.log('Retrived Sports',this.sportBets)
    });
  }
  clickedSport(sportId:number,sportName:string){
    // <a routerLink="/country/{{sport.SportId}}/{{removeSpaceFromSportType(sport.Name)}}">
    this.router.navigateByUrl(`/country/${sportId}/${this.removeSpaceFromSportType(sportName)}`);
  }
}
