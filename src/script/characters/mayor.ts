import { Events } from "../events";
import { $SM } from "../state_manager";
import { _ } from "../../lib/translate";
import { Liz } from "./liz";
import { Road } from "../places/road";

export const Mayor = {
    talkToMayor: function() {
		Events.startEvent({
			title: _('Meet the Mayor'),
			scenes: {
				start: {
					seenFlag: () => $SM.get('village.mayor.haveMet'),
					nextScene: 'main',
					onLoad: () => $SM.set('village.mayor.haveMet', 1),
					text: [
						_('The mayor smiles at you and says:'),
						_('"Welcome to Chadtopia, I\'m the mayor of these here parts. What can I do you for?"')
					],
					buttons: {
						'askAboutTown': {
							text: _('Ask about Chadtopia'),
							nextScene: {1: 'chadtopiaRamble'}
						},
						'quest': {
							text: _('Ask for a quest'),
							nextScene: {1: 'quest'}
						},
						'leave': {
							text: _('Leave'),
							nextScene: 'end'
						}
					}
				},
				'chadtopiaRamble': {
					text: [
						_('The mayor pushes the brim of his hat up.'),
						_('"Well, we\'ve always been here, long as I can remember. I took over after the last mayor died, but he would have been the only person with any historical knowledge of this village."'),
						_('He pauses for a moment and tousles some of the wispy hairs that have poked out from under the raised hat.'),
						_('"Actually, you might ask Liz, she has a bunch of her mother\'s books from way back when. She lives at the edge of town."')
					],
					buttons: {
						'okay': {
							text: _('Okay, then.'),
							nextScene: {1: 'main'},
							onChoose: Liz.setLizActive
						}
					}
				},
				'main': {
					text: [
						_('The mayor says:'),
						_('"Anyway, what ELSE can I do you for?"'),
						_('He chuckles at his clever use of language.')
					],
					buttons: {
						'askAboutTown': {
							text: _('Ask about Chadtopia'),
							nextScene: {1: 'chadtopiaRamble'}
						},
						'quest': {
							text: _('Ask for a quest'),
							nextScene: {1: 'quest'}
						},
						'leave': {
							text: _('Leave'),
							nextScene: 'end'
						}
					}
				},
				'quest': {
					text: [
						_('The mayor thinks for a moment.'),
						_('"You know, it\'s been a while since our last shipment of supplies arrived from the outpost. Mind looking into that for us?"'),
						_('"You can ask about it at the outpost, or just wander around on the road and see if you find any clues. Either way, it\'s time to hit the road, adventurer!"')
					],
					buttons: {
						'alrighty': {
							text: _('Alrighty'),
							nextScene: {1: 'main'},
							onChoose: Mayor.startSuppliesQuest
						}
					}
				}
			}
		});
	},
	startSuppliesQuest: function () {
		if (!$SM.get('quest.supplies')) {
			// 1 = started, 2 = next step, etc. until completed
			$SM.set('quest.supplies', 1);
			Road.init();
		}
		
	}
}