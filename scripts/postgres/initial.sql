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
   position   INT NOT NULL,
   created_at TIMESTAMP DEFAULT (TIMEZONE('utc', NOW())),
   updated_at TIMESTAMP DEFAULT NULL
);
