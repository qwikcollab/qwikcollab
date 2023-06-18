
---

<img align="left" src="https://i.ibb.co/25kXG8M/logo.png" alt="logo" width="130" height="130">

<div align="center"> 
<h1><b> QwikCollab  </b></h1>  
<i> Code, Share, Collaborate .... </i>
</div>

---

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li> 
        <a href="#about">About</a>
        <ul><a href="#intro"> Introduction </a></ul>
        <ul><a href="#the-core"> The core </a></ul>
        <ul><a href="#how-is-it-different"> How is it different </a></ul>
        <ul><a href="#contributing"> Contributing </a></ul>
    </li>
    <li><a href="#connect">Connect</a></li>
  </ol>
</details>

## Built With

<a><img alt="react" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"></a>
<a><img alt="codemirror" src="https://img.shields.io/badge/CodeMirror-A30705?style=for-the-badge&logo=CodeMirror&logoColor=white"></a>
<a><img alt="postgresql" src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white"></a>
<a><img alt="typescript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"></a>
<a><img alt="socketio" src="https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white"></a>

## Prerequisites

This is an example of how to list things you need to use the software and how to install them.

1. NodeJs
2. PostgreSQL

## Installation

1. Clone both the repositories
   ```shell
   git clone https://github.com/qwikcollab/qwikcollab.git
   git clone https://github.com/qwikcollab/server.git
   ```
2. Install NPM packages on both repositories, copy environment variables
   ```shell
   cd qwikcollab
   npm install
   ```
   ```shell
   cd server
   npm install
   cp .env.example .env
   ```
3. Make sure you have a PostgreSQL database running, update DATABASE_URL accordingly in server .env
4. Run prisma migration
   ```sh
   npx prisma migrate dev
   ```
5. Start em' all
   ```shell
   cd qwikcollab
   npm run dev
   ```
   ```shell
   cd server
   npm run start:dev
   ```

Contributions to the repository are welcome !!.

## Contributing

Contributions are welcome as the project needs a lot of improvements !!.
The project uses conventional commits for commit messages, make sure your
messages are in similar format. Before raising an MR, do format your
code using `npm run format`.

## About

### Intro

Qwikcollab is a collaborative code editor, it helps multiple people on dfferent machines collaborate over a single document
on a web page.

You can use qwikcollab to

1. Take interviews
2. Brainstorm with others over ideas

### The core

Qwikcollab uses operational transformation for managing document versions when
multiple people edit it, it uses `codemirror`
which is an extensible code editor package and also helps in
merging changes from different clients. The changes are transferred using `websockets`.

### How is it different

Well collaborative editing isn't a new thing, this is similar to Google Docs, it started off
with me experimenting with how collaborative editing works and eventually it turned into a project.
Hopefully this repository will be helpful for people who want to learn how collaborative editing
works

## Connect

If you find any issues, feel free to reach out to me on twitter
`@dumbbellcode` or linkedin `@sudheer121`. 
