const balance: HTMLElement = document.querySelector("#saldo")
const article: HTMLElement = document.querySelector("#transacoes")
const form: HTMLFormElement = document.querySelector("form");

interface Transaction {
  title: string
  price: string
  id: number
}

async function fetchTransaction() {
  const response = await fetch(`http://localhost:3000/transactions`)
  const transactions = response.json()
  return transactions
}

function creatediv(id: string) {
  const div = document.createElement("div")
  div.id = id
  return div
}

function createP(info: string) {
  const p = document.createElement("p")
  p.textContent = info
   return p
}

function createBtnEdit(transaction: Transaction) {
  const button = document.createElement("button")
  button.id = "edit"
  button.textContent = "Editar"
  button.type = "button"
  button.addEventListener("click", () => {
    document.querySelector<HTMLInputElement>("#id").value = String(transaction.id)
    document.querySelector<HTMLInputElement>("#name").value = transaction.title
    document.querySelector<HTMLInputElement>("#value").value = transaction.price
  })
  return button
}

function createBtnDelete(id: number) {
  const del = document.createElement("button")
  del.id = "delete"
  del.textContent = "Deletar"
  del.addEventListener("click", async () => {
    await fetch(`http://localhost:3000/transactions/${id}`, { method: "DELETE" })
    document.querySelector(`#transactions-${id}`).remove()
  })
  return del
}

function createHr() {
  const hr = document.createElement("hr")
  return hr
}

async function setBalance() {
  const transactions: Transaction[] = await fetchTransaction()
  const balanceTotal = transactions.reduce((accum, { price }) => accum + Number(price), 0)
  balance.textContent = `Saldo: R$${(balanceTotal.toFixed(2)).replace(".", ",")}`
}

function renderTransations(transaction: Transaction) {
  const divContainer = creatediv(`transation-${transaction.id}`)
  const title = createP(transaction.title)
  const price = createP(`R$${String(transaction.price).replace(".", ",")}`)
  const divButtons = creatediv("buttons")
  const btnEdit = createBtnEdit(transaction)
  const btnDelete = createBtnDelete(transaction.id)
  const hr = createHr()

  divButtons.append(btnEdit, btnDelete)
  divContainer.append(title, price, divButtons)
  article.append(divContainer, hr)
}

async function setup() {
  const transactions = await fetchTransaction()
  transactions.forEach((transaction: Transaction) => renderTransations(transaction));
  setBalance()
}

async function verifyId(id: string, title: string, price: string) {
  if(id) {
    const response = await fetch(`http://localhost:3000/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify({title, price}),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const result: Transaction = await response.json()
    document.querySelector(`#transaction-${id}`).remove()
    renderTransations(result)
  } else {
    const response = await fetch(`http://localhost:3000/transactions/`, {
      method: "POST",
      body: JSON.stringify({title, price}),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const result: Transaction = await response.json()
    renderTransations(result)
  }
}

function saveOrEdit(ev) {
  ev.preventDefault()
  
  const id = document.querySelector<HTMLInputElement>("#id").value
  const title = document.querySelector<HTMLInputElement>("#name").value
  const price = document.querySelector<HTMLInputElement>("#value").value

  verifyId(id, title, price)
  ev.target.reset()
}

document.addEventListener("DOMContentLoaded", setup)
form.addEventListener("submit", saveOrEdit)