import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NavbarComponent} from './navbar/navbar.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CountryComponent} from './country/country.component';
import {TournamentsComponent} from './tournaments/tournaments.component';
import {EventComponent} from './event/event.component';


const routes: Routes = [
{path:'dashboard',component:DashboardComponent},
{path:'navbar',component:NavbarComponent},
{path:'',redirectTo:'/dashboard',pathMatch:'full'},
{path:'country/:sportId/:sportName',component:CountryComponent},
// {path:'tournaments/:sportId/:countryId', component:TournamentsComponent},
{path:'betting/:sportId/:sportName/tournament/:tournamentId/:tournamentName', component:EventComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
