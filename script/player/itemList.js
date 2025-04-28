// all items go here, so that nothing silly happens in the event that they get put in Local Storage
// as part of the state management code; please save item names to the inventory, and then refer to 
// the item list via the item name
var ItemList = {
    "Liz.weirdBook": {
        name: 'Weird Book',
        text: _('A book you found at Liz\'s place. Supposedly has information about Chadtopia.'),
        onUse: function() { 
            Events.startEvent({
                title:  _("A Brief History of Chadtopia"),
                scenes: {
                    start: {
                        text: [
                            _('This book is pretty boring, but you manage to learn a bit more in spite of your poor attention span.'),
                            _('For example, you learn that "Chadtopia" doesn\'t have a capital \'T\'. That\'s pretty cool, huh?'),
                            _('... What were you doing again?')
                        ],
                        buttons: {
                            'okay': {
                                text: _('Something cooler than reading, probably'),
                                onChoose: Character.addToInventory("Liz.boringBook"),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            })
        },
        count: 1,
        destroyOnUse: true
    },

    "Liz.boringBook": {
        name: 'A Brief History of Chadtopia',
        text: _('Man, this book is boring.'),
        onUse: function() {
            Events.startEvent({
                title: _("A Brief Summary of a Brief History of Chadtopia"),
                scenes: {
                    start: {
                        text: [_('It\'s still just as boring as when you last tried to read it.')],
                        buttons: {
                            'okay': {
                                text: _('Dang.'),
                                nextScene: 'end'
                            }
                        }
                    }
                }
            })
        },
        count: 1,
        destroyOnUse: false
    },
}
