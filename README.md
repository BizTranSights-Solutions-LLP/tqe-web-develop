# TQE Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.4.

## Overview

The TQE Angular project works as a front-end of the TQE website, along with [Laravel](https://github.com/The-Quant-Edge/BetX_API) back-end API and MySQL database. 

### Components
Angular is a component-based framework. All existing components are located in `/src/app/`. Each component has corresponding `html`, `css` and `.ts` TypeScript files.

### Configurations 
Environment variables (e.g. API server address) are defined at `/src/app/environments`  
Dependencies are listed in `package.json`  
`angular.json` and `tsconfig.json` are for Angular and compiling options.  
App routing settings can be found at `/src/app/app.module.ts`. 

### Deployment
1.  SSH connect to the staging or production server  
2.  Change to the source code directory:  
```⁃   cd /var/www/tqe-web-src/```
3.  Switch to the desired branch and pull changes from the code base repository  
```⁃   git checkout tqe-remote <branch-name>```  
```⁃   git pull```  
or directly pull from master branch  
```⁃   git pull tqe-remote master``` 
4.  To deploy a new build to the staging instance run:  
```⁃   npm run build:stage```  
5.  To deploy a new build to the production (live) instance run:  
```⁃   npm run build:prod```  

## Staging site

The latest build is currently hosted at `https://staging.thequantumedge.com/`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

Test if i can make changes
