from flask import Flask, url_for
from flask_socketio import SocketIO, emit, send, join_room, leave_room
import json
import hashlib


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




@socketio.on('connect')
def on_connect():
    print('user connected')

@socketio.on('disconnect')
def on_disconnect():
    emit('refresh', broadcast=True)

def sha256_string(string):
    '''
    :type string: string
    :rtype: bytes
    '''
    return hashlib.sha256(string.encode('utf-8')).digest()

def getRoom(username, other_user):
    '''
    :type username: string
    :type other_user: string
    :rtype: bytes
    '''
    return b''.join(list(map(lambda x: sha256_string(x), sorted([username, other_user]))))

@socketio.on('message')
def handle_message(data):
    try:
        data = json.loads(data)
        msg = data['msg']
        username = data['username']
        other_user = data['other_user']
        room = getRoom(username, other_user)
    except:
        print("something is wrong\n\n\n")
        return False
    emit('message', (msg, username, other_user), room=room)

@socketio.on('join')
def on_join(data):
    try:
        data = json.loads(data)
        username = data['username']
        if not username:
            return False
        other_user = data['other_user']
        history = data['history']
        room = getRoom(username, other_user)
        join_room(room)
        emit('enter', (username + ' has entered the room.', username, other_user), room=room)
    except:
        print("something is wrong\n\n\n")
        return False

@socketio.on('leave')
def on_leave(data):
    try:
        data = json.loads(data)
        username = data['username']
        if not username:
            return False
        other_user = data['other_user']
        history = data['history']
        room = getRoom(username, other_user)
        leave_room(room)
        emit('exit', (username + ' has left the room.', username, other_user), room=room)
    except:
        print("something is wrong\n\n\n")
        return False

@socketio.on('request')
def request_info(data):
    try:
        data = json.loads(data)
        username = data['username']
        if not username:
            return False
        other_user = data['other_user']
        room = getRoom(username, other_user)
        emit('request_info', room=room)
    except:
        print("something is wrong\n\n\n")
        return False

@socketio.on('give_user')
def on_give_user(data):
    try:
        data = json.loads(data)
        username = data['username']
        if not username:
            return False
        other_user = data['other_user']
        room = getRoom(username, other_user)
        emit('receive_user', username, room=room)
    except:
        print("something is wrong\n\n\n")
        return False


if __name__ == '__main__':
	tempUsers = []
	socketio.run(app, host='127.0.0.1', port=5001, debug=True)