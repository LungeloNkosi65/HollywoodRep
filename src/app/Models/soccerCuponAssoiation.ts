import { Event } from '../Models/Ievent';
import {SoccerCupon} from '../Models/soccerCupon';
export interface CuponAssociation{
    event:Event;
    soccerCupon:SoccerCupon[];
};