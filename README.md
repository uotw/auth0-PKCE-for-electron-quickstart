# auth0-PKCE-for-electron-quickstart

This code is a working example of using auth0 Authorization Code Grant (PKCE) through Universal Login with a basic electron-quickstart.  It also optionally uses electron-online to check when the user loses internet access.

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/uotw/auth0-PKCE-for-electron-quickstart.git
# Go into the repository
cd auth0-PKCE-for-electron-quickstart/
# Install dependencies
npm install
#update main.js:
  # replace YOUR_AUTH0_CLIENT and YOUR_AUTH0_DOMAIN with appropriate values
  # ensure that you add YOUR_AUTH0_DOMAIN/mobile to your Allowed Callback URLs in auth0 dashboard 
# Run the app
npm start
```

## Credit
This code is just a working fork of @adeperio 's gist here: https://gist.github.com/adeperio/73ce6680d4b80b45e624ab62bacfbdca

## Comments and known issues
I get 3 Unhandled promise rejections (Access code callback url not expected) in the node console when I authenticate. I think this arises from the non-uri-encoded `config.redirectUri` match in js/AuthService.js: `return callbackUrl.indexOf(this.config.redirectUri) > -1;`, but when that line is changed the code breaks.

Authenticating this way requires an initial opening of an authentication window, then redirecting to the main window afterwards.  Just after authentication you will briefly see "OK" in the auth window before it is programtically closed.  

Using `openid` as the scope in this code results in the delivery of a JWT that should be authenticated and decoded as needed.  I've not included this additional code here.  Here are libraries to handle this task: https://jwt.io/
