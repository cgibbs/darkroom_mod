import { $SM } from "../state_manager";
import { Character } from "./character";
import { Quest } from "./quest";

export const QuestLog: {[id: string]: Quest} = {
    "mayorSupplies": {
        name: "Supplies for the Mayor",
        logDescription: "The mayor has asked you to get some supplies for him from the outpost.",
        phases: {
            0: {
                description: "Go check out the Road to the Outpost to see if you can find out more",
                requirements: {
                    0: {
                        renderRequirement: function() {
                            if ($SM.get('road.open') 
                                && $SM.get('Road.counter') === undefined)
                                return "I should go check out the Road to the Outpost";
                            else if ($SM.get('road.open') 
                                && $SM.get('Road.counter') !== undefined
                                && $SM.get('superlikely.outpostUnlock') === undefined)
                                return "I should keep exploring the Road to the Outpost";
                            else if ($SM.get('road.open') 
                                && $SM.get('superlikely.outpostUnlock') !== undefined
                                && $SM.get('superlikely.outpostUnlock') as number > 0)
                                return "I've found the way to the Outpost";
                        },
                        isComplete: function() {
                            return ($SM.get('road.open') 
                            && $SM.get('superlikely.outpostUnlock') !== undefined
                            && $SM.get('superlikely.outpostUnlock') as number > 0);
                        }
                    },
                }
            },
            1: {
                description: "Ask the Captain of the Outpost about the supplies",
                requirements: {
                    0: {
                        renderRequirement: function() {
                            if ($SM.get('superlikely.outpostUnlock') as number > 0
                                && $SM.get('outpost.captain.haveMet') === undefined)
                                return "I should try talking to the Captain of the Outpost";
                            else if ($SM.get('superlikely.outpostUnlock') as number > 0
                                && $SM.get('outpost.captain.haveMet') !== undefined
                                && $SM.get('outpost.captain.haveMet') as number > 0
                                && Character.inventory["Captain.supplies"] === undefined)
                                return "I should ask the Captain about the missing supplies";
                            else if ($SM.get('superlikely.outpostUnlock') as number > 0
                                && $SM.get('outpost.captain.haveMet') !== undefined
                                && $SM.get('outpost.captain.haveMet') as number > 0
                                && Character.inventory["Captain.supplies"] !== undefined)
                                return "I've gotten the supplies from the Captain";
                        },
                        isComplete: function() {
                            return ($SM.get('superlikely.outpostUnlock') as number > 0
                            && $SM.get('outpost.captain.haveMet') !== undefined
                            && $SM.get('outpost.captain.haveMet') as number > 0
                            && Character.inventory["Captain.supplies"] !== undefined);
                        }
                    }
                }
            },
            2: {
                description: "Return the supplies to the Mayor",
                requirements: {
                    0: {
                        renderRequirement: function() {
                            if ($SM.get('village.mayor.haveGivenSupplies') === undefined)
                                return  "I should hand these supplies over to the Mayor";
                            else if ($SM.get('village.mayor.haveGivenSupplies') === undefined
                                && $SM.get('village.mayor.haveGivenSupplies') as number > 0)
                                return "I've handed over the supplies to the Mayor";
                        },
                        isComplete: function() {
                            return ($SM.get('village.mayor.haveGivenSupplies') === undefined
                            && $SM.get('village.mayor.haveGivenSupplies') as number > 0);
                        }
                    }
                }
            }
        }
    }
}