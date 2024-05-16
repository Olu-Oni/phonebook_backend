const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
// morgan.token('info', (tokens, res,req)=>{
//   return [
//     tokens.method(req, res),
//     tokens.url(req, res),
//     tokens.status(req, res),
//     tokens.res(req, res, 'content-length'), '-',
//     tokens['response-time'](req, res), 'ms',
//     tokens.req(req, res, 'body')
//   ].join(' ')
// })

morgan.token('info', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))



let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};
const newPhoneNum = () => {
  const num = Math.random().toFixed(11).toString();
  const newNum = num.slice(2).split("");
  newNum.splice(2, 0, "-");
  newNum.splice(5, 0, "-");
  return newNum.join("");
};

app.get("/api/persons", (request, response) => {
  console.log(request.headers);
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<div>
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>
  </div>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  response.json(persons.find((person) => person.id === id));
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  console.log(persons);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  if (persons.find((p) => p.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number ? body.number : newPhoneNum(),
  };
  persons = persons.concat(person);
  response.json(person);
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
