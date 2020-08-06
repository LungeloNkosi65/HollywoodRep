import { Country } from '../iCountry';
import { Tournament } from '../iToutnament';

export interface CountryTournamentAssociation {
    id: number;
    country: Country;
    tournaments: Tournament[];
  }