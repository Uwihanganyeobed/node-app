create database l4sod;

use l4sod;

create table users(
  id int primary key auto_increment,
  name varchar(20),
  email varchar(20),
  age int
  );
