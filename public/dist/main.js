var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const balance = document.querySelector("#saldo");
const article = document.querySelector("#transacoes");
const form = document.querySelector("form");
function fetchTransaction() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:3000/transactions`);
        const transactions = response.json();
        return transactions;
    });
}
function creatediv(id) {
    const div = document.createElement("div");
    div.id = id;
    return div;
}
function createP(info) {
    const p = document.createElement("p");
    p.textContent = info;
    return p;
}
function createBtnEdit(transaction) {
    const button = document.createElement("button");
    button.id = "edit";
    button.textContent = "Editar";
    button.type = "button";
    button.addEventListener("click", () => {
        document.querySelector("#id").value = String(transaction.id);
        document.querySelector("#name").value = transaction.title;
        document.querySelector("#value").value = transaction.price;
    });
    return button;
}
function createBtnDelete(id) {
    const del = document.createElement("button");
    del.id = "delete";
    del.textContent = "Deletar";
    del.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        yield fetch(`http://localhost:3000/transactions/${id}`, { method: "DELETE" });
        document.querySelector(`#transactions-${id}`).remove();
    }));
    return del;
}
function createHr() {
    const hr = document.createElement("hr");
    return hr;
}
function setBalance() {
    return __awaiter(this, void 0, void 0, function* () {
        const transactions = yield fetchTransaction();
        const balanceTotal = transactions.reduce((accum, { price }) => accum + Number(price), 0);
        balance.textContent = `Saldo: R$${(balanceTotal.toFixed(2)).replace(".", ",")}`;
    });
}
function renderTransations(transaction) {
    const divContainer = creatediv(`transation-${transaction.id}`);
    const title = createP(transaction.title);
    const price = createP(`R$${String(transaction.price).replace(".", ",")}`);
    const divButtons = creatediv("buttons");
    const btnEdit = createBtnEdit(transaction);
    const btnDelete = createBtnDelete(transaction.id);
    const hr = createHr();
    divButtons.append(btnEdit, btnDelete);
    divContainer.append(title, price, divButtons);
    article.append(divContainer, hr);
}
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const transactions = yield fetchTransaction();
        transactions.forEach((transaction) => renderTransations(transaction));
        setBalance();
    });
}
function verifyId(id, title, price) {
    return __awaiter(this, void 0, void 0, function* () {
        if (id) {
            const response = yield fetch(`http://localhost:3000/transactions/${id}`, {
                method: "PUT",
                body: JSON.stringify({ title, price }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const result = yield response.json();
            document.querySelector(`#transaction-${id}`).remove();
            renderTransations(result);
        }
        else {
            const response = yield fetch(`http://localhost:3000/transactions/`, {
                method: "POST",
                body: JSON.stringify({ title, price }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const result = yield response.json();
            renderTransations(result);
        }
    });
}
function saveOrEdit(ev) {
    ev.preventDefault();
    const id = document.querySelector("#id").value;
    const title = document.querySelector("#name").value;
    const price = document.querySelector("#value").value;
    verifyId(id, title, price);
    ev.target.reset();
}
document.addEventListener("DOMContentLoaded", setup);
form.addEventListener("submit", saveOrEdit);
