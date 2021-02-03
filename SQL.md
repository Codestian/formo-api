# SQL commands used in project and what they do

## This file demonstrates knowledge of SQL.

### 1. Create database **schema**

```sql
CREATE SCHEMA db_formo;
```

- A schema is where tables of the project is stored in.

### 2. Create **table** in **schema** created to store notes

```sql
CREATE TABLE db_formo.notes (
    id serial NOT NULL PRIMARY KEY,
    title varchar(64) NOT NULL,
    body varchar(512) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

- In postgres, to make sure the primary key increments after each row, we use the type `serial`.
- A primary key serves to uniquely identify a row.
- The type `varchar()` allows a custom character limit.
- The type `TIMESTAMPTZ` stores a date and time in UTC format, with timezone. This means if the database timezone changes, the value changes too.


