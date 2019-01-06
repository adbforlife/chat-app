from flask import Flask
from flask_socketio import SocketIO, emit, join_room, leave_room
import json
import hashlib

app = Flask(__name__)
app.config['SECRET_KEY'] = b"\xa1H\x81\xc10\xd72\xdf:'\xd6\xb7\xe0\x01\xca-"
socketio = SocketIO(app)

'''
Handles username list updates.
'''
@socketio.on('broadcast_request')
def request():
    emit('username_request', broadcast=True)

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

@socketio.on('connect')
def on_connect():
    print('user connected')

@socketio.on('disconnect')
def on_disconnect():
    emit('refresh', broadcast=True)



'''
Handles messaging within rooms.
'''
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
        room = getRoom(username, other_user)
        leave_room(room)
        emit('exit', (username + ' has left the room.', username, other_user), room=room)
    except:
        print("something is wrong\n\n\n")
        return False



'''
Handles other user requests.
'''
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

@socketio.on('hydrate')
def on_hydrate():
    emit('hydrate', broadcast=True)

if __name__ == '__main__':
	tempUsers = []
	socketio.run(app, host='127.0.0.1', port=5001)
