# Ontology TS VM

## Overview

Ontology TS VM is Ontology Smart contract virtual machine written in Typescript. This VM is used in SmartX debugger and Test framework for Ontology Smart contracts.


### What does it currently do

* Execute NEOVM assembly (AVM)
* Execution environment handling
* Multiple Smart contract deployment
* Custom blockchain state spoofing
* Custom smart contract state spoofing
* Native contracts (ONT/ONG)

## Usage

Examples of usage can be found in tests forlder.

## Installation

### Required Tools and Dependencies

* Node
* Npm

### Developing and Running

Execute these commands in the project's root directory:

#### Download
```
git clone 'https://github.com/OntologyCommunityDevelopers/ontology-ts-vm.git'
cd ontology-ts-vm
```

#### Install

```
npm install
```

#### Development build
This will build the project with minimum polyfilling for better debug experience.

````
npm run build:dev
````

You will get the packaged code under '/lib'.


#### Production build 

````
npm run build:prod
````

You will get the packaged code under '/lib'

## Built With

* [TypeScript](https://www.typescriptlang.org/) - Used language
* [Node.js](https://nodejs.org) - JavaScript runtime for building

## Authors

* **Matus Zamborsky** - *Initial work* - [Backslash47](https://github.com/backslash47)

## License

This project is licensed under the LGPL License - see the [LICENSE.md](LICENSE.md) file for details.
