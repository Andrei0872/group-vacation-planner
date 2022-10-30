CREATE TABLE "user" (
	id serial primary key,
	username varchar(80) unique not null,
	password varchar(65) not null,
	email varchar(255) unique not null,
	created_at timestamp default now()
);
