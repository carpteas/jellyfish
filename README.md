# jellyfish

The "jellyfish" is an *unlimited* storage service for all kinds of static web resources. Once stored, every single asset will be *proxied* by CDN automatically. There is a reference site(jellyfish.carpteas.com) running to play with. Key components consisting the service are:

  - Amazon S3
  - CloudFlare
  - Heroku
  - Json Web Token
  - Node.js

### Version
0.1.0

### Installation
jellyfish requires [Node.js](https://nodejs.org/) v4.4.5+ to run.

```sh
$ git clone [git-repository-url] jellyfish
$ cd jellyfish
$ npm install
$ npm start
```

### Usages
GET: /

GET: /asset/[EXT]/[NAME]/[PATH]?u=[USER]
>/asset/jpg/flower/house/backyard/garden?u=richard

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
https://e52032-richard.s3-ap-northeast-1.amazonaws.com/280d5ff8f2229ffb782eede1e8c7745b22b86db5a59967911164c8da59a327ce/flight.jpg?AWSAccessKeyId=AKIAJQ75TXVUWG3LPMVQ&Expires=1464881612&Signature=IwUv5vB4mmLOaO2jqr1%2B%2BOQju6w%3D&x-amz-acl=private
```

PUT: [PUT_URL_TO_S3]

    request body as binary
        file content

DELETE: /api/[EXT]/[NAME]/[PATH]
>/api/jpg/blank/

    request header
        x-access-token: [TOKEN]

### Todos
 - bulk upload of assets
 - image transformation on demand

License
----

MIT