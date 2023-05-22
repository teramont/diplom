"use strict";
/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * Наследуется от AsyncForm
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const accountsSelect = this.element.querySelector(".accounts-select");
    Account.list(User.current(), (err, response) => {
      if (response && response.data) {
        accountsSelect.innerHTML = "";
        response.data.forEach(item => {
          accountsSelect.innerHTML += `<option value="${item.id}">${item.name}</option>`;
        });
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(options) {
    Transaction.create(options.data, (err, response) => {
      if (response && response.success) {
        const modal = document.querySelectorAll(".modal");
        modal.forEach(form => {
          if (form.getAttribute("id") == "modal-new-income") {
            App.getModal("newIncome").close();
          } else if (form.getAttribute("id") == "modal-new-expense") {
            App.getModal("newExpense").close();
          }
        });
        App.update();
        this.element.reset();
      }
    })
  }
}