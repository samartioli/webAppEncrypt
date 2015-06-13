# WebApp Encrypt Demo

A very simple example to show how to encrypt data in a webClient using a symetric and asymetric keys

## Requirements

- [git](http://git-scm.com/downloads)

- <http://nodejs.org>

- <http://bower.io>

- NPM global modules:

    npm install -g bower http-server

## Quick Start

    git clone git@github.com:samartioli/webAppEncrypt.git
    
    # WebApp
    cd webAppEncrypt/webApp
    bower install
    http-server

    # Server (in a new window)
    cd webAppEncrypt/server
    npm install
    node index.js

You should now be able to hit: <http://localhost:8080>

Open the developers console to see more info. (command-option-j in Chrome)

## Create Different Private/Public Key Pairs

Generate a private key:

	openssl genrsa -out private.pem 2048

Generate a public key:

	openssl rsa -pubout -in private.pem -out public.pem


