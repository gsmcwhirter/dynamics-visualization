__author__="gmcwhirt"
__date__ ="$Nov 4, 2010 2:23:19 PM$"

import os
import tornad_io as stio
import tornado.web as tweb

class EchoHandler(stio.SocketIOHandler):
    def on_open(self, *args, **kwargs):
        logging.info("Socket.IO Client connected with protocol '%s' {session id: '%s'}" % (self.protocol, self.session.id))
        logging.info("Extra Data for Open: '%s'" % (kwargs.get('extra', None)))

    def on_message(self, message):
        logging.info("[echo] %s" % message)
        self.send("[echo] %s" % message)

    def on_close(self):
        logging.info("Closing Socket.IO Client for protocol '%s'" % (self.protocol))

echoRoute = EchoHandler.routes("echoTest", "(?P<sec_a>123)(?P<sec_b>.*)", extraSep='/')

application = tweb.Application([
    echoRoute
], enabled_protocols=['websocket', 'flashsocket', 'xhr-multipart', 'xhr-polling'],
   flash_policy_port=8043, flash_policy_file='/etc/lighttpd/flashpolicy.xml',
   socket_io_port=8888,
   static_path=os.path.join(os.path.dirname(__file__), "../client"))

print os.path.join(os.path.dirname(__file__), "/static")

if __name__ == "__main__":
    socketio_server = stio.SocketIOServer(application)