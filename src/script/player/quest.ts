import { $SM } from "../state_manager"
import { Character } from "./character"

export interface Quest {
    name: string,
    // description of the quest; who gave it, what it's about, what to do, etc.
    logDescription: string,
    // numbered phases, e.g. "1: go find the way to the outpost", "2: pick up 
    // the supplies from the captain", "3: bring them back to the mayor"
    phases: {
        [id: number]: {
            description: string,
            requirements: {
                [id: number]: {
                    // this should return something like "Gemstoness gathered: 3/5" or
                    // "Prisoners freed: 7/10"; it's left as a vague function to allow for 
                    // some more interesting behavior in the quest log later on, if needed
                    renderRequirement: Function,
                    // this should obviously mirror the renderRequirement function,
                    // but just return a boolean value based on whether the requirements are
                    // all completed
                    isComplete: Function
                }
            }
        }
    }
}

// empty quest for easy copy-pasting in future development
const exampleQuest: Quest = {
    name: "",
    logDescription: "",
    phases: {
        1: {
            description: "",
            requirements: {
                1: {
                    renderRequirement: function() {
                        
                    },
                    isComplete: function() {
                        
                    }
                }
            }
        }
    }
}

const dk2Quest: Quest = {
    name: "Diddy Kong's Quest",
    logDescription: "Diddy Kong has to save DK... or something. I didn't play"
    + "this game enough to know what it's actually about.",
    phases: {
        1: {
            description: "Go talk to Cranky Kong to figure out what happened",
            requirements: {
                1: {
                    renderRequirement: function() {
                        if (Character.questStatus["exampleQuest"]) {
                            return "I still need to do this";
                        }
                    },
                    isComplete: function() {
                        return (Character.questStatus["exampleQuest"] as number > 1);
                    }
                }
            }
        },
        2: {
            description: "Go beat like, three levels or whatever",
            requirements: {
                1: {
                    renderRequirement: function() {
                        if ($SM.get('level1.complete') !== true) {
                            return "I need to beat level 1";
                        } else {
                            return "I've beaten level 1";
                        }
                    },
                    isComplete: function() {
                        return ($SM.get('level1.complete') == true);
                    }
                },
                2: {
                    renderRequirement: function() {
                        if ($SM.get('level2.complete') !== true) {
                            return "I need to beat level 2";
                        } else {
                            return "I've beaten level 2";
                        }
                    },
                    isComplete: function() {
                        return ($SM.get('level2.complete') == true);
                    }
                },
                3: {
                    renderRequirement: function() {
                        if ($SM.get('level3.complete') !== true) {
                            return "I need to beat level 3";
                        } else {
                            return "I've beaten level 3";
                        }
                    },
                    isComplete: function() {
                        return ($SM.get('level3.complete') == true);
                    }
                },
            }
        },
        3: {
            description: "I need to score 2300 points or higher on the arcade cabinet",
            requirements: {
                1: {
                    renderRequirement: function() {
                        if ($SM.get('arcade.highestScore') === undefined)
                            return "I need to play the arcade cabinet in the mall";
                        else if ($SM.get('arcade.highestScore') as number < 2300)
                            return "Highest score: " + $SM.get('arcade.highestScore') + "/2300";
                        else
                            return "I've beaten the high score";
                    },
                    isComplete: function() {
                        return $SM.get('arcade.highestScore') as number > 2300;
                    }
                }
            }
        }
    }
}
