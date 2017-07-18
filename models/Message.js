// var method = Message.prototype;

// function Message(age) {
//     this._age = age;
// }

// method.getAge = function() {
//     return this._age;
// };

// module.exports = Message;

class Message {
    constructor() {}

    getAllMessages() {
        var data = [
            {
                'id': 1,
                'title': 'Here is the first title',
                'content': 'Here is the first content.',
                'approved': 0
            },
            {
                'id': 2,
                'title': 'Here is the second title',
                'content': 'Here is the second content.',
                'approved': 1
            },
        ];

        // var data = {
        //     'messages': [
        //         {
        //             'title': 'Here is the first title',
        //             'content': 'Here is the first content.'
        //         },
        //         {
        //             'title': 'Here is the second title',
        //             'content': 'Here is the second content.'
        //         },
        //     ]
        // }



        return data;
    }
}

module.exports = Message;