const header_start_search_button = document.querySelector(".top-bar__header-start-search-button") //Кнопка лупы в шапке
const header = document.querySelector(".header"); //Блок для шапки
const top_bar = document.querySelector(".top-bar"); //Шапка
const header_search_field = document.querySelector(".header-search-field") //Поле ввода поискового запроса в шапке 
const header_search_input = document.querySelector(".header-search-input"); //Строка ввода поискового запроса в шапке 
const header_search_button = document.querySelector(".header-search-lens"); //Кнопка лупы для поиска в строке поискового запроса в шапке
const header_search_cross = document.querySelector(".header-cross"); //Кнопка крестика для очистки информации в строке поиска в шапке

let search_text = sessionStorage.getItem("search_text"); //Поисковый запрос
/**
 * Отслеживание нажатия на лупу в шапке
 */
header_start_search_button.addEventListener("click", () => {
    header_search_field.classList.toggle("hidden");
})
/**
 * Отслеживанеи нажатия на крестик в строке поиска в шапке
 */
header_search_cross.addEventListener("click", () => {
    header_search_input.value = "";
    header_search_field.classList.toggle("hidden");
})
/**
 * Отслеживание нажатия лупы в строке поиска в шапке
 */
header_search_button.addEventListener("click", () => {
    header_search_enter_req();
    sessionStorage.setItem("search_text", search_text);
    window.location.href = 'search_page.html';
})
/**
 * Отслеживания нажатия Enter в строке поиска в шапке
 */
header_search_input.addEventListener("keydown", (key) => {
    if(key.code === "Enter"){
        header_search_enter_req();
        sessionStorage.setItem("search_text", search_text);
        window.location.href = 'search_page.html';
    }
})

/**
 * Функция открытия/закрытия поисковой строи в шапке
 */
function header_search_enter_req(){
    if(header_search_input.value != ""){
        search_text = header_search_input.value;
        header_search_input.value = "";
        header_search_field.classList.toggle("hidden");
    }
}
