import { CustomOdds } from './customOdds';
import {Event} from '../Models/Ievent';

export interface EventMarkets{
    events:Event;
    markets:CustomOdds[];
}