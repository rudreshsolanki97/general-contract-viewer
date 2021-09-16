# General Contract Viewer

Live At: https://gcv.xinfin.network/

## Setup

### Run Locally

Create a file `.env` from `.env.example` Change variable as per mode  -`online` / `offline`

```
  npm i 
  npm start
```

### Online Setup

 Create a file `.env` from `.env.example` and change variable value to `online`

 ```
  npm i 
  npm run build
 
 ```
This will generate an online version of build. You can then serve the `/build` folder


### Offline Setup

 Create a file `.env` from `.env.example` and change variable value to `offline`

 ```
  npm i 
  npm run build
 
 ```

This will generate an offline version of build. You can then serve the `/build` folder


## To Do:
- [x] Bifurcation for functions ( Read & Write ), events
- [x] Offline Signing option
- [x] Added private key & keystore
