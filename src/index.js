const express = require("express")
const {v4: uuidv4} = require("uuid")

const app = express()

app.use(express.json())

const customers = []


function verifyIfExistAccountCPF(req, res, next){
  const { cpf } = req.headers

  const customer = customers.find(customer => customer.cpf === cpf)

  if(!customer) {
  return res.status(400).json({error: "Custumer not found"})
  }

  req.customer = customer

  return next()
}


app.post("/account", (req, res) => {
  const {cpf, name} = req.body

  const customerAlreadyExists = customers.some((customer)=> customer.cpf === cpf)

  if(customerAlreadyExists){
    return res.status(400).json({error: "Customer alreaady exists"})
  }

   
 
 
  customers.push({
    cpf,
    name,
    id:uuidv4(),
    statement: []
})

return res.status(201).send()

})

app.get("/statement",verifyIfExistAccountCPF, (req, res) => {
 
  const { customer } = req
  
  return res.json(customer.statement)
})

app.post("/deposit",verifyIfExistAccountCPF, (req, res) => {
const { description, amount} = req.body

const {customer} = req

const statementOperation = {
  description,
  amount,
  created_at: new Date(),
  type: "credit"
}

customer.statement.push(statementOperation)

return res.status(201).send()

})

app.get("/statement/date",verifyIfExistAccountCPF, (req, res) => {
 
  const { customer } = req
  const { date } =  req.query

  const dateFormat =  new Date(date + " 00:00")

  const statement = customer.statement.filter(
  (statement) => 
  statement.created_at.toDateString() === 
  new Date(dateFormat).toDateString()
  )

  return res.json(statement)
})

app.listen(3333)