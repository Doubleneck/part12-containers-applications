db.createUser({
    user: 'the_username',
    pwd: 'the_password',
    roles: [
      {
        role: 'dbOwner',
        db: 'the_database',
      },
    ],
  });

  
  db.people.insert({ name: 'Aku ankka', number: '040-313313' });
  db.people.insert({ name: 'Donald Trump', number: '000-0000000' });