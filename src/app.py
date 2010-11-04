__author__="gmcwhirt"
__date__ ="$Nov 4, 2010 2:23:19 PM$"

import tornado.httpserver as thttp
import tornado.ioloop as tio
import tornado.web as tweb

class MainHandler(tweb.RequestHandler):
    def get(self):
        self.write("Hiya!")

application = tweb.Application([
    (r"/", MainHandler)
])

if __name__ == "__main__":
    http_server = thttp.HTTPServer(application)
    http_server.listen(9090)
    tio.IOLoop.instance().start()
