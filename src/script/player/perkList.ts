// master list of perks

import { _ } from "../../lib/translate";
import { Perk } from "./perk";

export const PerkList: {[id: string]: Perk} = {
    'tummyPain': {
        name: 'Socked in the Stomach',
        text: 'This doesn\'t seem like a perk, tbh',
        fullText: [
            _("You got his in the stomach really hard."),
            _("Like, REALLY hard. By a grinning jerk.")
        ],
        isActive: () => true,
        statBonuses: { },
        timeLeft: -1
    }
}