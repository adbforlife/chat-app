from flask import Flask, url_for
from flask_socketio import SocketIO, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)

@app.route('/hello')
def hello():
	print(url_for('hello'))
	return "hiadb"

@socketio.on('message')
def handleMessage(msg):
	print('Message: ' + msg)
	send(msg, broadcast=True)


if __name__ == '__main__':
	socketio.run(app, host='127.0.0.1', port=5001, debug=True)
	print(url_for('hello'))