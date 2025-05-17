import { _ } from "../../lib/translate";
import { Character } from "../player/character";
import { $SM } from "../state_manager";

export const habasi = {
    fullName: "Sugar-Lips Habasi",
    greeting: { // text for the initial conversation screen

    },
    // THESE MUST ALWAYS BE IN THE CORRECT ORDER, AT LEAST FOR NOW
    questChain: [
        { 
            name: "tgQuest1",
            // shouldn't be necessary with current setup
            // isAvailable: () => $SM.get('character.memberOfThievesGuild') !== undefined,
            onStart: () => {
                Character.addKeyword('diamond');
            },
            introText: _("A friend wants a diamond from Habasi. Nalcarya of White Haven had diamonds last time Habasi sniffed out her store. Bring Habasi a diamond."),
            inProgressText: _("Have you found a diamond for Habasi?"),
            // this should be handled in the dialogue tree
            //completeText: "Yes, a diamond. Habasi will take care of everything. Habasi cannot pay you until Habasi's friend pays Habasi... But Habasi has this potion to give you."
        },
        {
            name: "tgQuest2",
            onStart: () => {
                
            },
            introText: "WIP",
            inProgressText: "WIP"
        },
        {
            name: "tgQuest3",
            onStart: () => {
                
            },
            introText: "WIP",
            inProgressText: "WIP"
        }
    ],
    // the Event should filter these based on isAvailable() and whether the Character knows the associated keyword
    dialogue: {
        'balmora': {
            name: "Balmora",
            isAvailable: () => true,
            onChoose: () => {
                
            },
            text: [
                _("Habasi likes it here. The air is dry, and the people are incurious.")
            ]
        },
        'job': {
            name: "Job",
            isAvailable: () => true,
            onChoose: () => {

            },
            // check for ongoing quests, if none then assign one based on availability; if ongoing, return relevant text
            text: () => {
                let quest = null;
                for (const questIndex in habasi.questChain) {
                    // undefined exclusively denotes an unaccepted quest
                    if (Character.questStatus[questIndex] !== undefined
                        // -1 exclusively denotes completed quest
                        && Character.questStatus[questIndex] > -1
                    ) {
                        // use first non-accepted, non-complete quest in chain
                        quest = habasi.questChain[questIndex];
                        break;
                    }
                }

                // have not accepted any quests from NPC
                if (quest === null) {
                    if ($SM.get('character.memberOfThievesGuild') === undefined) {
                        // not a member of the TG
                        return [
                            _("Habasi knows not what you speak of.")
                        ]
                    } else {
                        // attempt to get the next quest and assign it
                        // same for loop as above, kind of annoying to repeat it
                        let newQuest = null;
                        for (const questIndex in habasi.questChain) {
                            if (Character.questStatus[questIndex] !== undefined
                                && Character.questStatus[questIndex] > -1
                            ) {
                                newQuest = habasi.questChain[questIndex];
                                break;
                            }
                        }
                        if (newQuest === null) {
                            Character.addKeyword('sadrithMora');
                            Character.addKeyword('aldruhn');
                            return [
                                _("Habasi has no jobs for you. Ask Aengoth the Jeweler in Ald'ruhn or Big Helende in Sadrith Mora.")
                            ]
                        } else {
                            // start new quest, do the onStart() stuff and return intro text
                            Character.setQuestStatus(newQuest.name, 1);
                            newQuest.onStart();
                            return [
                                newQuest.introText
                            ]
                        }
                    }
                } else {
                    // handle current quest progress
                    return [
                        quest.inProgressText
                    ]
                }
            },

        }
    }
}