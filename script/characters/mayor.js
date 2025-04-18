var Mayor = {
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
						'cancel': {
							text: _('cancel'),
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
						'cancel': {
							text: _('cancel'),
							nextScene: 'end'
						}
					}
				},
				'quest': {
					text: [
						_('The mayor looks confused'),
						_('"Well, shucks, it looks like Chance didn\'t write me one of these yet! Better try again later."')
					],
					buttons: {
						'wack': {
							text: _('Wack'),
							nextScene: {1: 'main'}
						}
					}
				}
			}
		});
	}
}