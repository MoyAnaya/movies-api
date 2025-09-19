create database if not exists movies_db;
use movies_db;

create table if not exists movies(
    id int auto_increment primary key,
    titulo varchar(255),
    genero varchar(100),
    ano_lanzamiento int,
    url_imagen text,
    created_at timestamp default current_timestamp
);


