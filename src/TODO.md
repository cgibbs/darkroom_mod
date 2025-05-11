Use Notifications for mundane worldbuilding stuff. What's going on in the world that isn't mission-critical, but sets the tone? Birds chirping, the sun glistening through the trees, etc. Can occasionally have things happen here that unlock important stuff, but use that as a tool sparingly.

IMPORTANT: Anything that needs to persist on the character or in the inventory that isn't handled via $SM access will need to be put in the $SM at some point, preferably on any change to the character or its inventory. Write functions for changing stats, adding items, equipping gear, etc. and make sure those things all write to $SM at the end. When loading from $SM, make sure that it's the only source of truth and the load is fresh, so as not to introduce the possibility of duplicates.

DONE Make a second location, and a quest from the mayor to go there. This should be a good place to introduce a very basic encounter system through the event system. Just kick off the "choose random event for this area" stuff with a button click that says "Wander around" or whatever.

DONE Make a really basic weather system using the Engine's setTimeout delay system. Just set up a delay time range, then call the setTimeout button with a function that picks from possible weather states and sets it accordingly. Can have minor stat impacts, but it would also be cool to have a minimal interface animation to represent the weather, like some dashed lines for rain or snowflakes falling or whatever. Could even change the background color a bit near the top of the screen to emphasize the change. Call "setWeather" in location's onArrival function using the availableWeather array that should exist on every location. If no availableWeather, default to sunny.

DONE, NOT TESTED If the weather callback is still in-flight after location has changed, don't do a weather change. The easiest way to handle this is probably to send the current location with the callback, and if it no longer matches current location when it actually fires, then just skip it. This avoids the issue of going somewhere with a different set of possible weather conditions and having the callback throw an impossible weather condition into the mix.

DONE-ISH, CAN BE HANDLED VIA PERKS It would be cool to create stat changes based on weather. Like, speed decreasing in the snow, perception decreasing in clouds (and worse in rain), etc. Do a basic example of this with the perception example. This will necessitate a method to derive Character stats anew with each character stat change, so create a handleStateChange method in Character and make it work based on a second set of values. For example, character.stats.tempChanges. This state variable will need to know what provided the stat change so that it can be removed or altered when that thing changes.

The ::before element on the Stores area not being animateable via JQuery makes the background color changes look kinda janky. Maybe figure out a better way to do that title effect so that it can be animated smoothly.

DONE Create script for Road to Outpost, and init it in the Mayor's quest acceptance thing.

DONE Create script for Outpost, and init it in the wander events for Road to Outpost after a certain number of turns spent wandering. Need to add a "times adventured" counter to $SM and increment it each time the player clicks the Wander Around button.

Eventually there will be too many tabs to manage cleanly. I think tabs should be grouped under like, Locales of some description. We'd need to do a load step sorta like how the Engine checks for init conditions for the locations, but do it based on a Locale, so like, the village, the outpost, etc. are all in "The Northern Shore", but if you want to go further, you'll need to do something to change Locales, and then that'll load a whole new set of tabs and stuff. We could also bring weather out to the Locale level, instead of the Location level, and then only initiate new weather for Locations that need it for specific purposes.

Could make a simple "Equipment" inventory in the Stores section. Click an item to use or equip it, Equipment is in a separate section from general items, and Equipment pieces have knowledge of what slot they fill. Probably better to do something more flexible with the inventory in State Manager than ("inventory.blah", 1). Inventory items should be complex objects, and if they have a "slot" field then they get filtered into the Equipment section. Equipment items that can also be used can open a modal (one like the Event panel, probably, rather than figuring out a popover menu at the chosen item) to choose whether to use or equip it. If an item is destroyed on use, we might add a tiny bit of friction in case of misclicks. Probably more interesting to the player to always pop up a modal with information about the item, and then have a "Use" button to make sure that's what they want to do. That way it doesn't only warn for items that will disappear, which would give the player too much meta-knowledge.

DONE-ISH It might be cool to make an item start out with a generic name, and get a new name and functionality when the player clicks it. Like, "a knife wrapped in cloth" can be used, and in doing so becomes "a silver knife", which can be equipped. This *could* be used to create some loot-boxy sort of drive in players, but I'd rather it just be more about the feeling of getting an item and then realizing what it is after you do some additional investigating. For a different example, "Weird book" becomes "A Comprehensive History of Chadtopia". 

Equipment could also have hidden properties that are revealed through equipping or using them via an "onEquip" function, which would add the hidden properties to the item. Could also have a more generic "isVisible" function that will keep the effects functioning without showing them to the player until something happens to make that effect known. This should also probably include an "onUnequip" that removes the onEquip effects (or doesn't, if it's a curse).

MOOT, NEED A PROPER INVENTORY SCREEN Anchor stores area to character area so it doesn't slide away.

Can do weather-specific events in the isAvailable function, that would be cool.

BROKEN DOWN INTO SMALLER TASKS Overloading the stores area as an inventory is going to become painful really fast. Might as well make a proper inventory screen that the player can click open and page through items in. Probably good to add a search filter to narrow down objects, too, but I'm not sure how easy that is to do in raw JS/HTML/CSS. We can also just make Inventory a part of the Character script, since it's the character's inventory. We'll need to change some $SM checks to use like, Character.hasItem("whatever"), but it's better to do this now.

DONE Make Inventory system
DONE Make Equipment system
DONE Make Perk system

DONE Create Inventory screen that shows all items in player inventory
DONE Create Clickable items in Inventory and hook up Character.useInventoryItem(item) to the clickable items
Paginate Inventory items
Create some test equipment
Show Equipment separately in Inventory screen
Equipping Equipment can probably skip the Event framework, just make the onEquip() for an item say how you put it on as a Notification.

Move the Notifications stuff to not be under the character panel; maybe over where the stores stuff used to display?

DONE, AND IT WAS ANNOYING Saving and Loading doesn't keep functions on items, so if you refresh the page the onUse() function disappears from items. That's... annoying. I guess we'll need to define items globally and use the name as a reference in the Character file, so that no functions get destroyed accidentally by Local Storage.

DONE Implement super-likely events. Some quest areas and places where you randomly unlock other areas might be too dependent on randomness and lead to some players taking a long time to unlock them. Events can have "superLikely" conditions on them, and if those conditions are met, they'll automatically get chosen. SuperLikely conditionals should have a dedicated flag, so that they can only be triggered once. We can put those in $SM under "superlikely.blah". We'll also need to implement counters for number of adventures in a location, probably in $SM under "counter.blah".

Fix weather animation stuff, it broke during the Typescriptification process.

DONE, JUST USE `npm run deploy` INSTEAD Deployment is broken by the new file structure, and gulp doesn't run correctly on Github's Workflow thing. 

Need to make the button images stuff much less janky. Make button size and image size work together more cleanly (currently button height is hardcoded to 170px if there's an image provided to the button). Make text more readable.

DONE Add description text for Locations!

DONE Add a Quest Log button and UI area!

KINDA DELAYED THE NECESSITY OF THIS Quest Log could use a "Complete" section that's accessible by button. This will be more useful when there's more than one quest, and when that one quest can actually be completed, lol.

DONE Add a notification when Quest Log or inventory is updated.

Refactor Locations to have less repeated code around initializing and rendering them, maybe.

DONE Implement a shorthand function for state-based descriptive text, and use it on the Village's description based on whether Liz is known, whether the first quest is completed, etc. Then add it to the Mayor's quest text, for when he inevitably gives you another quest.

DONE-ISH Add more RoadWander events, having only the one makes it seem broken.