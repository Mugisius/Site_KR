let link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'styles.css';
document.head.appendChild(link);

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (event) => {
        // Ожидаем подтверждения от пользователя
        const isConfirmed = confirm("Вы действительно хотите добавить товар в корзину?");

        // Если пользователь подтвердил
        if (isConfirmed) {
            alert("Товар добавлен в корзину!");
        } else {
            event.preventDefault(); // Отменяем действие по умолчанию, если пользователь не подтвердил
        }
    });
});


/*_____index_____*/

// Функция для добавления/удаления товара в/из избранного
function toggleFavorite(productId, productName, productImage, productUrl) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Проверяем, если товар уже в избранном
    const productIndex = favorites.findIndex(item => item.id === productId);

    if (productIndex === -1) {
        // Если товара нет в избранном, добавляем его
        favorites.push({ id: productId, name: productName, image: productImage, url: productUrl });
    } else {
        // Если товар есть в избранном, удаляем его
        favorites.splice(productIndex, 1);
    }

    // Сохраняем обновленный список в localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Обновляем иконку кнопки
    updateFavoriteButtonState(productId);
}

// Обновляем обработчик кликов на кнопки "Добавить в избранное"
document.querySelectorAll('.add-to-favorites').forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const productName = button.dataset.productName;
        const productImage = button.dataset.productImage;
        const productUrl = button.dataset.productUrl;

        toggleFavorite(productId, productName, productImage, productUrl);
    });

    // Обновляем иконку при загрузке страницы
    const productId = button.dataset.productId;
    updateFavoriteButtonState(productId);
});

// Функция для обновления состояния кнопки "Добавить в избранное"
function updateFavoriteButtonState(productId) {
    const button = document.querySelector(`[data-product-id="${productId}"]`);
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Если товар в избранном, меняем иконку на заполненное сердце
    const isFavorite = favorites.some(item => item.id === productId);
    const icon = button.querySelector('i');

    if (isFavorite) {
        icon.classList.remove('far', 'fa-heart');
        icon.classList.add('fas', 'fa-heart');
    } else {
        icon.classList.remove('fas', 'fa-heart');
        icon.classList.add('far', 'fa-heart');
    }
}

/*_____slider_____*/

window.addEventListener('load', () => {
    const sliderThumb = document.querySelector('.slider-thumb');
    const sliderTrack = document.querySelector('.slider-track');
    let isDragging = false;

    // Функция для обновления позиции бегунка
    const updateSlider = (event) => {
        if (!isDragging) return;

        let trackRect = sliderTrack.getBoundingClientRect();
        let offsetY = event.clientY - trackRect.top;  // Получаем координату по Y
        offsetY = Math.max(0, Math.min(offsetY, trackRect.height - sliderThumb.offsetHeight)); // Ограничиваем в пределах track

        sliderThumb.style.top = `${offsetY}px`;
    };

    // Начало перетаскивания
    sliderThumb.addEventListener('mousedown', (event) => {
        isDragging = true;
        document.body.classList.add('no-select');  // Отключаем выделение текста
        updateSlider(event); // обновляем положение сразу при нажатии
        document.body.style.cursor = 'ns-resize';
    });

    // Перетаскивание
    document.addEventListener('mousemove', updateSlider);

    // Окончание перетаскивания
    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.classList.remove('no-select');  // Включаем выделение текста обратно
        document.body.style.cursor = 'default';
    });

    // Обработка выхода за пределы слайдера
    document.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            document.body.classList.remove('no-select');  // Включаем выделение текста обратно
            document.body.style.cursor = 'default';
        }
    });
});




/*_____favorite_____*/

window.addEventListener('load', () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesList = document.getElementById('favorites-list');

    // Проверяем, что находится в localStorage
    console.log(favorites);

    if (favorites.length === 0) {
        favoritesList.innerHTML = "<p>Ваше избранное пусто.</p>";
    } else {
        favorites.forEach(item => {
            if (item && item.id && item.name && item.image && item.url) {
                const productDiv = document.createElement('div');
                productDiv.classList.add('favorite-item');
                productDiv.innerHTML = `
                    <a href="${item.url}">
                        <img src="${item.image}" alt="${item.name}" />
                    </a>
                    <div>
                        <h3>${item.name}</h3>
                        <div id="buttons" class="buttons">
                            <button id="add-to-cart" > Добавить в корзину </button>
                            <button onclick="removeFavorite('${item.id}')">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                `;
                favoritesList.appendChild(productDiv);
            }
        });
    }
});

function removeFavorite(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(item => item.id !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    window.location.reload();
}

function addToCart(productId, productName, productImage) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = { id: productId, name: productName, image: productImage };

    if (!cart.some(item => item.id === productId)) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${productName} добавлен в корзину!`);
    }
}
