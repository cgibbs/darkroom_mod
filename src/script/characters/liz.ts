import { Events } from "../events";
import { $SM } from "../state_manager";
import { _ } from "../../lib/translate";
import { Room } from "../places/room";
import { Character } from "../player/character";

export const Liz = {
    setLizActive: function() {
		$SM.set('village.lizActive', true);
		$SM.set('village.liz.canFindBook', false);
		$SM.set('village.liz.hasBook', 1);
		Room.updateButton();
	},

	talkToLiz: function() {
		Events.startEvent({
			title: _('Liz\'s house, at the edge of town'),
			scenes: {
				start: {
					seenFlag: () => $SM.get('village.liz.haveMet'),
					nextScene: 'main',
					onLoad: () => $SM.set('village.liz.haveMet', 1),
					text: [
						_('You enter the building and are immediately plunged into a labyrinth of shelves haphazardly filled with books of all kinds. After a bit of searching, you find a side room where a woman with mousy hair and glasses is sitting at a writing desk. She\'s reading a large book that appears to include diagrams of some sort of plant. She looks up as you enter the room.'),
						_('"Who the hell are you?"')
					],
					buttons: {
						'askAboutTown': {
							text: _('Ask about Chadtopia'),
							nextScene: {1: 'chadtopiaRamble'}
						},
						'quest': {
							text: _('Ask for a quest'),
							nextScene: {1: 'questRequest'}
						},
						'leave': {
							text: _('Leave'),
							nextScene: 'end'
						}
					}
				},
				'chadtopiaRamble': {
					text: [
						_('Liz looks at you for a moment before returning her gaze to the book in front of her.'),
						_('"There\'s a book in here somewhere about the founding of Chadtopia. If you can find it, you\'re free to borrow it."')],
					buttons: {
						'okay': {
							text: _('Okay, then.'),
							nextScene: {1: 'main'},
							onChoose: () => $SM.set('village.liz.canFindBook', true)
						}
					}
				},

				'main': {
					text: [_('Liz seems determined not to pay attention to you.')],
					buttons: {
						'askAboutTown': {
							text: _('Ask about Chadtopia'),
							nextScene: {1: 'chadtopiaRamble'},
							available: () => !$SM.get('village.liz.canFindBook')
						},
						'quest': {
							text: _('Ask for a quest'),
							nextScene: {1: 'questRequest'}
						},
						'findBook': {
							text: _('Try to find the book'),
							nextScene: {1: 'findBook'},
							// TODO: a "visible" flag would be good here, for situations where an option
							//   isn't yet known to the player
							visible: () => $SM.get('village.liz.canFindBook'),
							available: () => ($SM.get('village.liz.canFindBook') as number > 0) && ($SM.get('village.liz.hasBook'))
						},
						'leave': {
							text: _('Leave'),
							nextScene: 'end'
						}
					}
				},
				'findBook': {
					text: [
						_('Leaving Liz to her business, you wander around amidst the books, wondering how you\'ll ever manage to find what you\'re looking for in all this unorganized mess.'),
						_('Fortunately, the creator of this game doesn\'t feel like it\'d be very interesting to make this into a puzzle, so you spot the book on a nearby shelf and grab it.')
					],
					buttons: {
						'sick': {
							text: _('Oh, sick'),
							nextScene: 'end',
							onChoose: () => {
								// $SM.set('stores.Weird Book', 1);
								Character.addToInventory("Liz.weirdBook");
								$SM.set('village.liz.hasBook', 0);
							}
						}
					}
				},
				'questRequest': {
					text: [
						_('Liz lets out an annoyed sigh.'),
						_('"Oh brave adventurer, I seem to have lost my patience. When last I saw it, it was somewhere outside of this building. Wouldst thou recover that which has been stolen from me?"')
					],
					buttons: {
						'okay': {
							text: _('Okay, jeez, I get it'),
							nextScene: {1: 'main'}
						}
					}
				}
			}
		});
	}
}