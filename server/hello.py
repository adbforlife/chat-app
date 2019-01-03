from flask import Flask, url_for
from flask_socketio import SocketIO, emit, send, join_room, leave_room
import json


app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)


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
def handle_message(msg):
	print('Message: ' + msg)
	emit('message', msg, broadcast=True)

@socketio.on('connect')
def on_connect():
    print('user connected')

'''@socket.on('activate_user')
def on_active_user(data):
    user = data.get('username')
    emit('user_activated', {'user': user}, broadcast=True)'''

# Handle usernames
@socketio.on('broadcast_request')
def request():
	emit('username_request', broadcast=True)

@socketio.on('init')
def initial_add(data):
	emit('init', data, broadcast=True)

@socketio.on('broadcast_add')
def user_add(data):
	emit('user_list_add', data, broadcast=True)

@socketio.on('broadcast_del')
def user_del(data):
	emit('user_list_del', data, broadcast=True)


@socketio.on('join')
def on_join(data):
	data = json.loads(data)
	print(data['username'] + ' joining')
	username = data['username']
	if not username:
		return False
	room = data['room']
	join_room(room)
	send(username + ' has entered the room.' + room + '\n\n', room=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', room=room)


if __name__ == '__main__':
	tempUsers = []
	socketio.run(app, host='127.0.0.1', port=5001, debug=True)