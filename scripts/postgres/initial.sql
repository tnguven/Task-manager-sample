CREATE TABLE users
(
   id         BIGSERIAL PRIMARY KEY,
   email      VARCHAR(255) UNIQUE NOT NULL,
   password   VARCHAR(255)        NOT NULL,
   created_at TIMESTAMP DEFAULT (TIMEZONE('utc', NOW()))
);

CREATE TABLE tasks
(
   id         BIGSERIAL PRIMARY KEY,
   user_id    INT REFERENCES users (id) ON DELETE CASCADE,
   title      VARCHAR(255),
   content    TEXT,
   created_at TIMESTAMP DEFAULT (TIMEZONE('utc', NOW()))
);

CREATE TABLE task_order
(
   user_id  INT REFERENCES users (id) ON DELETE CASCADE,
   task_id  INT REFERENCES tasks (id) ON DELETE CASCADE,
   position INT NOT NULL,
   PRIMARY KEY (user_id, task_id)
);