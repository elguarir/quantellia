import { Hono } from 'hono'

const documents = new Hono()
  .get('/', (c) => c.json('list documents'))
  .post('/', (c) => c.json('create an document', 201))
  .get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default documents