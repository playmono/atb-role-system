import { Role } from "./Role";

export class Hero {
    level: 1;
    range: Range;
    role: Role;

    health: {
        current: integer,
        max: integer,
    };

    attack: {
        physical: integer,
        magical: integer,
    };

    defense: {
        physical: integer,
        magical: integer,
    };
}
