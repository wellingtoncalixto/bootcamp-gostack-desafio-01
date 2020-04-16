const express = require('express')
const cors = require('cors');
const {uuid, isUuid} = require('uuidv4')

const api = express();

api.use(cors())
api.use(express.json());

const repositories = [];


function logRequest(request, response, next) {
  const {method, url} = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.log(logLabel)
  return next()
}

function isValaidId(request, response, next) {
  const {id} = request.params

  if(!isUuid(id)) {
    return response.status(400).json({error: "Id invalid"})
  }

  return next();
}

api.use(logRequest)
api.use('/repositories/:id', isValaidId)


api.get('/repositories', (request, response) => {
  return response.json(repositories);
})

api.post('/repositories', (request, response) => {
  const {title, url, techs} = request.body

  const repository = {id: uuid(), title, url, techs, likes: 0}
  
  repositories.push(repository)

  return response.json(repository)
})

api.put('/repositories/:id', (request, response) => {
  const {id} = request.params;
  let {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0) {
    return response.status(400).json({mensage: 'repository not found'})
  }

  const old = repositories[repositoryIndex]
  
  if (!title) {
    title = old.title
  }

  if (!url) {
    url = old.url
  }

  if (!techs) {
    techs = old.techs
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: old.likes
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)
})


api.delete('/repositories/:id', (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0) {
    return response.status(400).json({mensage: 'repository not found'})
  }

 repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
})

api.post('/repositories/:id/like', isValaidId, (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0) {
    return response.status(400).json({mensage: 'repository not found'})
  }

  repositories[repositoryIndex].likes++

  const repository = repositories[repositoryIndex]

  return response.json(repository)
})


api.listen(3333, () => {
  console.log('🚀️ Back-end Started')
})