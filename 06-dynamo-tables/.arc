@app
arc-demo

@html
get /
get /about
post /count

@json
get /api
post /person

@tables
people
  peopleID *String
  name **String
  #birthDate
  #createdAt
  #updatedAt
