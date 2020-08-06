import { Component, OnInit, Input } from '@angular/core';
import { Tournament } from '../iToutnament';
import { TournamentsService } from '../tournaments.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Country } from '../iCountry';

export interface CountryTournamentAssociation {
  id: number;
  country: Country;
  tournaments: Tournament[];
}
@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css']
})
export class TournamentsComponent implements OnInit {

  @Input() selectCountry: any;
  // @Input() tempValue: number;
   tournamentsArray: any[];  ////this will hold the tournaments when thet country is clicked from the parent component side
   tournaments: Tournament[];   //this will hold data from the api call
  private _tournamentValue: CountryTournamentAssociation; 
  constructor(private tournamentService: TournamentsService, private route: ActivatedRoute, private router: Router) 
  { 
    console.log('Child component is in');

  }

  ngOnInit(): void {
    // this.route.params.subscribe(routParams => {
    // });
      this.getTournamentByCountry();

    this.getTournamentsData(this.selectCountry,this.getSportId());

  }

  //this works fine
  getTournamentByCountry() {
    const sportId = +this.route.snapshot.paramMap.get('sportId');
    const countryId = +this.route.snapshot.paramMap.get('countryId');
    return this.tournamentService.getTournaments(sportId, countryId).subscribe((data: any) => {
      this.tournaments = data;
      console.log('...fetched tournaments ', data);
    });
  }
  getTournamentsData(country: any, id: number) ///this will return data from the api
  {
    const sportId = +this.route.snapshot.paramMap.get('sportId');
    this.tournamentService.getTournaments(id, country.CountryId).subscribe((data: any) => {
      this.tournaments = data;
      console.log('retrieved tournaments',data);
    })
  }

  selectedTournament(tournamentId: number) {
    console.log('tournamentId', tournamentId)
    this.router.navigateByUrl(`events/${tournamentId}`);
  }
   addToList(country:any, tournament:Tournament[]){ //create an instance of the tournamentsport association and pushed to the service
     this._tournamentValue={
       id:this.tournamentsArray.length+1, //makes the id unique for every entry
       country:country,
       tournaments:tournament
     }
   }

   pushToList(countryTournaments:any) //add to tournaments association list. 
   {
     //first check if the object being passed exists to avoid duplicates
     this.tournamentsArray.push(countryTournaments);

   }

   getSportId(){
    return +this.route.snapshot.paramMap.get('sportId');

   }



}
