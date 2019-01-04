from flask import Flask, url_for
from flask_socketio import SocketIO, emit, send, join_room, leave_room
import json


app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)


@socketio.on('broadcast_request')
def request():
    emit('username_request', broadcast=True)

@socketio.on('init')
def initial_add(data):
    if not data:
        return
    emit('init', data, broadcast=True)

@socketio.on('broadcast_add')
def user_add(data):
    if not data:
        return
    emit('user_list_add', data, broadcast=True)

@socketio.on('broadcast_del')
def user_del(data):
    if not data:
        return
    emit('user_list_del', data, broadcast=True)


@app.route('/login', methods=['GET', 'POST'])
def login():
    # Here we use a class of some kind to represent and validate our
    # client-side form data. For example, WTForms is a library that will
    # handle this for us, and we use a custom LoginForm to validate.
    form = LoginForm()
    if form.validate_on_submit():
        # Login and validate the user.
        # user should be an instance of your `User` class
        login_user(user)

        flask.flash('Logged in successfully.')

        next = flask.request.args.get('next')
        # is_safe_url should check if the url is safe for redirects.
        # See http://flask.pocoo.org/snippets/62/ for an example.
        if not is_safe_url(next):
            return flask.abort(400)

        return flask.redirect(next or flask.url_for('index'))
    return flask.render_template('login.html', form=form)


@socketio.on('message')
def handle_message(data):
    try:
        data = json.loads(data)
        msg = data['msg']
        username = data['username']
        room = data['room']
    except:
        print("something is wrong\n\n\n")
        return False
    emit('message', (username, msg, room), room=room)

@socketio.on('connect')
def on_connect():
    print('user connected')

@socketio.on('disconnect')
def on_disconnect():
    emit('refresh', broadcast=True)




@socketio.on('join')
def on_join(data):
    try:
        data = json.loads(data)
        username = data['username']
        if not username:
            return False
    except:
        print("something is wrong\n\n\n")
        return False
    room = data['name']
    other_user = data['other_user']
    history = data['history']
    join_room(room)
    print(data['username'] + ' joined room ' + room)
    emit('rooms', username + ' has entered the room.' + room + '\n\n', room=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    emit('rooms', username + ' has left the room.', room=room)


if __name__ == '__main__':
	tempUsers = []
	socketio.run(app, host='127.0.0.1', port=5001, debug=True)