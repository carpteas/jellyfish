# jellyfish

The "jellyfish" is an *unlimited* storage service for all kinds of static web resources. Once stored, every single asset will be *proxied* by CDN automatically. BLITLINE as the transformation engine, enables any stored image to be processed on the fly, then cached on CDN as long as subsequent requests hold the same RESTful url. To demonstrate all jellyfish's RESTful APIs, the reference site http://jellyfish.carpteas.com is up and running; feel free to play with it.

Key components contributing to this cloud-based service are:
  - Amazon S3
  - BLITLINE
  - CloudFlare
  - Heroku
  - JSON Web Tokens
  - Postman
  - mongoDB
  - Node.js
  - redis
  - socket.io

### Version
0.1.0

### Installation
jellyfish requires [Node.js](https://nodejs.org/) v4.4.5+ to run.

```sh
$ git clone git@github.com:carpteas/jellyfish.git
$ cd jellyfish
$ npm install
$ npm start
```

### Usages
GET: /

GET: /asset/[EXT]/[NAME]/[PATH]?u=[USER]
>/asset/jpg/flower/house/backyard/garden?u=richard.peng

POST: /api/authenticate

    request body as form-data
        username: [USER]
        password: [PASS]
    response json
        "token": "[TOKEN]"

TOKEN's sample
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJpY2hhcmQiLCJwYXNzd29yZCI6ImFjMzc4ODU0ZmMxOTVlNzBlNjg0MjI1MmM1MTI4MTgzNGM2MjYwNjgyMjljYzc1Y2Q0YWUzNzg3NGZlMzk4NzMiLCJpYXQiOjE0NjQ4ODEyOTcsImV4cCI6MTQ2NDg4MzA5N30.HfKip9RTRxmcWi0WD_A2i6E2qsZrcQfDiSh01KOXWPM
```

GET: /api/list

    request header
        x-access-token: [TOKEN]

PUT: /api/[EXT]/[NAME]/[PATH]
>/api/jpg/flower/house/backyard/garden

    request header
        x-access-token: [TOKEN]
    response json
        "signedUrl": "[PUT_URL_TO_S3]"

PUT_URL_TO_S3's sample
```
https://e52032-richard.peng.s3-ap-northeast-1.amazonaws.com/280d5ff8f2229ffb782eede1e8c7745b22b86db5a59967911164c8da59a327ce/flight.jpg?AWSAccessKeyId=AKIAJQ75TXVUWG3LPMVQ&Expires=1464881612&Signature=IwUv5vB4mmLOaO2jqr1%2B%2BOQju6w%3D&x-amz-acl=private
```

PUT: [PUT_URL_TO_S3]

    request body as binary
        file content

DELETE: /api/[EXT]/[NAME]/[PATH]
>/api/jpg/put-into-root-directory-is-also-valid/

    request header
        x-access-token: [TOKEN]

### Transformation
GET: /asset/[EXT]/[NAME]/[PATH]?u=[USER]**&x=[BLITLINE_FUNCTION]**

BLITLINE_FUNCTION should be a url encoded json string. Nesting(chained) functions are supported but each depth needs to contain exact one function. Lastly, the most inner function must provide "image_identifier" to indicate the result. Check blitline_functions_builder.js for samples.

BLITLINE_FUNCTION's sample: resize to 720x540
```
%7B"name"%3A"resize"%2C"params"%3A%7B"width"%3A720%2C"height"%3A540%7D%2C"save"%3A%7B"image_identifier"%3A"demo"%7D%7D
```

BLITLINE_FUNCTION's sample: add lines from 4 corners torward center + watermark on a 720x540 image
```
%7B"name"%3A"line"%2C"params"%3A%7B"x"%3A10%2C"y"%3A10%2C"x1"%3A100%2C"y1"%3A100%2C"width"%3A4%2C"opacity"%3A0.5%7D%2C"functions"%3A%5B%7B"name"%3A"line"%2C"params"%3A%7B"x"%3A710%2C"y"%3A10%2C"x1"%3A610%2C"y1"%3A100%2C"width"%3A4%2C"opacity"%3A0.5%7D%2C"functions"%3A%5B%7B"name"%3A"line"%2C"params"%3A%7B"x"%3A10%2C"y"%3A530%2C"x1"%3A100%2C"y1"%3A430%2C"width"%3A4%2C"opacity"%3A0.5%7D%2C"functions"%3A%5B%7B"name"%3A"line"%2C"params"%3A%7B"x"%3A710%2C"y"%3A530%2C"x1"%3A610%2C"y1"%3A430%2C"width"%3A4%2C"opacity"%3A0.5%7D%2C"functions"%3A%5B%7B"name"%3A"watermark"%2C"params"%3A%7B"text"%3A"jellyfish"%7D%2C"save"%3A%7B"image_identifier"%3A"demo"%7D%7D%5D%7D%5D%7D%5D%7D%5D%7D
```

For all supported functions, go and check https://www.blitline.com/docs/functions.

### Todos
 - bluebird for promises
 - bulk upload of assets
 - https instead of http

License
----

MIT