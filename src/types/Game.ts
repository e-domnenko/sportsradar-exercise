export default interface Game {
    id: number;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    createdAt: number;
}

export type GameInit = Pick<Game, 'homeTeam' | 'awayTeam'>;