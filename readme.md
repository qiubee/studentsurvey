# Studentsurvey

[Website](https://vragenlijst-medezeggenschap.herokuapp.com/)

Survey for students about their knowledge & interest of the participation councils of the Amsterdam University of Applied Sciences. This repo consists of a [client](client) with the survey-page and a [server](server) to process and save the results.

## Installation

First clone the repository and navigate to the client or server directory. Then follow the installation steps for the [client](#client) and the [server](#server).

### Client

To install the client dependencies use:

```bash
npm install
```

To build the client files in the dist folder type:

```bash
npm run build
```

If you want to run the server with npm, then use:

```bash
npm run serve
```

### Server

To install the server run:

```bash
go install studentsurvey/server
```

To run the server:

```bash
go run server.go
```

