# supersimplehttpserver
One-file HTTP server for static files.

Put it in your directory and start it:

```
wget https://raw.githubusercontent.com/bteixeira/supersimplehttpserver/master/server.js
node server
```

Optionally pass in a port number as a single argument
```
node server 9002
```

Notice that the default port is 9001, which is over nine thousand.  
  
That's it. It just serves all files in that directory (and subdirs).  
  
No, it doesn't do anything else.  
Yes, the browser will complain about MIME types.
