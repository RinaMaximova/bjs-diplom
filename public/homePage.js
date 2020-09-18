"use strict";

const logoutButton = new LogoutButton();
const moneyManager = new MoneyManager();
const favorites = new FavoritesWidget();
const rates = new RatesBoard();

// Кнопка logout
logoutButton.action = () => {
    ApiConnector.logout((response) => {
        if (response.success === true) {
            location.reload();
        }
    })
};

// Пополнение баланса
moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) => {
        if (response.success === true) {
            moneyManager.setMessage(response.success, 'Баланс пополнен');
            getCurrentProfile();
            return
        }

        moneyManager.setMessage(response.success, response.error);
    });
};

//Конвертация
moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success === true) {
            moneyManager.setMessage(response.success, 'Валюта сконвертирована');
            getCurrentProfile();
            return
        }

        moneyManager.setMessage(response.success, response.error);
    });
};

//Отправка валюты
moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        if (response.success === true) {
            moneyManager.setMessage(response.success, 'Валюта отправлена');
            getCurrentProfile();
            return
        }

        moneyManager.setMessage(response.success, response.error);
    });
};

//Добавление в избранное
favorites.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success === true) {
            favorites.setMessage(response.success, 'Пользователь добавлен в избранное');
            getFavorites();
            return
        }

        favorites.setMessage(response.success, response.error);
    })
};

//Удаление из избранного
favorites.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success === true) {
            favorites.setMessage(response.success, 'Пользователь удален из избранного');
            getFavorites();
            return
        }

        favorites.setMessage(response.success, response.error);
    })
};


//Старт страницы
start();

// Функции
//Котировки
function getCurrentRates() {
    ApiConnector.getStocks((response) => {
        if (response.success === true) {
            rates.clearTable();
            rates.fillTable(response.data)
        }
    });
}

//Данные текущего пользователя
function getCurrentProfile() {
    ApiConnector.current((response) => {
        if (response.success === true) {
            ProfileWidget.showProfile(response.data)
        }
    });
}

//Избранное
function getFavorites() {
    ApiConnector.getFavorites((response) => {
        if (response.success === true) {
            favorites.clearTable();
            favorites.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        }
    });
}

function start() {
    getCurrentProfile();
    getCurrentRates();
    getFavorites();
    setInterval(() => getCurrentRates, 60000);
}
