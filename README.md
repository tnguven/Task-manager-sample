# Some task ordering sample

Sample application for a small task.

https://github.com/tnguven/Task-manager-sample/assets/6273412/9830fc3a-14eb-46cd-bf4f-0ea1dbcc1319

## Main folder structure

```shell
scripts\                # Initialize script for postgres
pkg\            
   |--client\           # Next.js
   |--cors\             # Nginx reverse proxy setup
   |--server\           # Express server
docker-compose.dev.yml  # main orchestrator
docker-compose-test.yml # run postgres as integration tests deps
Dockerfile.client       # Client image
Dockerfile.server       # Server image
Makefile                # main works
```

### Quick start

makefile support is one of a dependency to run prepared command. Make start will run the database and all the apps. When its done
just visit the http://localhost to render the login page.

``` makefile
make start
```

Try this is make file support doesn't exist. Run the commands manually.

``` shell
# cd to the root of the project
cp env.example .env && \
docker compose -f docker-compose.dev.yml up -d
```

### Basic commands from the root

``` json
"scripts": {
  "test:unit": "pnpm run test:server:unit && pnpm run test:client:unit",
  "test:server:unit": "pnpm --filter=@task/api test:unit",
  "test:client:unit": "pnpm --filter=@task/client test:unit",
  "test:server:integration": "docker compose -f docker-compose-test.yml up -d && pnpm --filter=@task/api test:integration && docker compose -f docker-compose-test.yml down",
},
```

### To run the tests 

``` shell
pnpm install
pnpm run test:unit # to run the unit tests for client and server
pnpm run test:server:integration # to run the supertest for server api 
```

### .env

Default I set up env for make the local stuff works. DOMAIN will be responsible for shortUrl prefix.

```dotenv
DB_NAME=tasks
DB_USERNAME=admin
DB_PASSWORD=admin
DB_HOST=postgresdb
DB_PORT=5432

SERVER_HOST=http://localhost/api/v1
PORT=8080
CLIENT_PORT=3000
```

- The candidate would need to build a full stack application. The frontend should be written in React and typescript and the backend in Express and TypeScript. The database of choice should be PostGresSQL and the queries should be written in vanilla SQL using the PG package (no fancy ORMs).
- The application should have an authentication page and 2 protected pages.
- Page 1) should have one input box where the user can create a task then there should be a column where all the tasks can be stored. The user will have the option drag and drop the tasks in whatever order they like inside the “column”. Finally when the components unmounts all the results and ORDER of the task on the column needs to be saved in the database. If  new session starts and the user navigates to that page the “tasks” from the database needs to be fetched and placed back in the column in the same order.

- Page 2) can just have a h1 header. The only purpose of the second page is so the user can navigate between the 2 pages and the content of the Page1 should be stored on a global state (preferable either redux or Zustand) so once you navigate back to Page 1 , the content (i.e. the order of the tasks on that column is as it used to be before the user navigated away from that page)

NOTE : THE CSS is not important on this task you can have as basic/simple CSS as you would like.

Final request is to have 1 test written for both frontend and backend (any type of test you like)
