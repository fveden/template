const search_categories_list = document.querySelector(".search-categories") //Список категорий поиска
const artists_list = document.querySelector(".artists-list"); //Список секции найденных артистов
const albums_list = document.querySelector(".albums-list"); //Список секции найденных альбомов
const tracks_list = document.querySelector(".tracks-list"); //Список секции найденных треков
const search_input = document.querySelector(".search-input"); //Строка ввода поискового запроса
const search_input_button = document.querySelector(".search-lens"); //Кнопка ввода поискового запроса(лупа)
const search_input_cross = document.querySelector(".cross") //Кнопка очистки поискового запроса(крестик)
const search_result_area = document.querySelector(".search-left-column") //Левая колонка для отображения информации о поиске
const search_result_header = document.querySelector(".search-header") //Заголовок для поля отображения поискового результата

 const search_api_key = sessionStorage.getItem("api_key"); //Устанавливаем апи ключ
let categorie_type = "Top results"; //Категория поискового запроса
search_text = sessionStorage.getItem("search_text"); //Устанавливаем текст поискового запроса

let data_artists; //Найденные артисты
let data_albums; //Найденные альбомы
let data_tracks //Найденные треки

/**
 * Входная функция для сбора всей необходимой информации и ее отображения
 */
async function start(){
    if(search_text != ""){
        await fetch_all_data();
        show_search_result  ();
        if(data_artists.results.artistmatches.artist.length === 0
            && data_albums.results.albummatches.album.length === 0
            && data_tracks.results.trackmatches.track.length === 0
        )
        {
            alert("Nothing was found");
        }
    }
    else{
        alert("Input search request");
    }
    
}

start();

/**
 * Отслеживание нажатия Enter при вводе поиска
 */
search_input.addEventListener("keydown", (key) => {
    if(key.code === "Enter"){
        search_text = search_input.value;
        start();
    }
});
/**
 * Отслеживание нажатия на лупу при поиске
 */
search_input_button.addEventListener("click", () => {
        search_text = search_input.value;
        start();
})
/**
 * Отслеживание нажатия на крестик в строке поиска
 */
search_input_cross.addEventListener("click", () => {
    search_input.value = "";
})
/**
 * Отслеживание переключения категорий в списке категорий
 */
search_categories_list.addEventListener("click", (event) => {
    if(event.target.nodeName === "A"){
        if(!event.target.classList.contains("active-category")){
            turn_off_active_category();
            event.target.classList.toggle("non-active-category");
            event.target.classList.toggle("active-category");
            categorie_type = event.target.textContent;
            show_search_result(); 
        }
    }
});

/**
 * Переключение классов для категорий, реализация выбора категории поиска
 */
function turn_off_active_category(){
    search_categories_list.querySelectorAll(".search-category").forEach((el) => {
        if(el.classList.contains("active-category")){
            el.classList.toggle("active-category")
            el.classList.toggle("non-active-category")
        }
    })
}
/**
 * Функция отображения секции результата поиска в зависимоси от выбранной категории
 */
function show_search_result(){
    clear_search_result_area();
    switch(categorie_type)
    {
        case "Top results":
            show_top_result();
            break;
        case "Artists":
            show_artists_result();
            break;
        case "Albums":
            show_albums_result();
            break;
        case "Tracks":
            show_tracks_result();
            break;
    }
}
/**
 * Отображение всех категорий
 */
function show_top_result(){
    search_result_header.textContent = `Search results for \"${search_text}\"`;
    search_input.value = search_text;
    show_artists_result();
    show_albums_result();
    show_tracks_result();
}
/**
 * Отображение результатов по категории артистов
 */
async function show_artists_result(){
    search_result_area.appendChild(create_search_content_section("Artists"));
    let list = document.querySelector(".artists-list");
    data_artists.results.artistmatches.artist.forEach(el => {
        insert_data_artist(list,
                            el.name,
                            el.listeners,
                            el.url,
                            el.image[3]["#text"] === "" ? undefined : el.image[3]["#text"]
        )
    })
}
/**
 * Отображение результатов по категории альбомов
 */
async function show_albums_result(){
    search_result_area.appendChild(create_search_content_section("Albums"));
    let list = document.querySelector(".albums-list");
    data_albums.results.albummatches.album.forEach(el => {
        const artist_url = el.url.slice(0, el.url.lastIndexOf("/"));
        insert_data_album(list,
                            el.name,
                            el.url,
                            el.artist,
                            artist_url,
                            el.image[3]["#text"] === "" ? undefined : el.image[3]["#text"]
        );
        
    })

}
/**
 * Отображение результатов по категории треков
 */
async function show_tracks_result(){
    search_result_area.appendChild(create_search_content_section("Tracks"));
    let list = document.querySelector(".tracks-list");
    data_tracks.results.trackmatches.track.forEach(el => {
        const artist_url = el.url.slice(0, el.url.lastIndexOf("/")-2);
        insert_data_tracks(list,
                            el.name,
                            el.url,
                            el.artist,
                            artist_url,
                            el.image[1]["#text"] === "" ? undefined : el.image[1]["#text"]
        );
        
    })
}
/**
 * Извлечение всей необходимой информации по поиску
 */
async function fetch_all_data(){
    await Promise.all([fetch_artists_result(), fetch_albums_result(), fetch_tracks_result()]).then(
        ([data1, data2, data3]) => {
            data_artists = data1;
            data_albums = data2;
            data_tracks = data3;
        }
    )
}
/**
 * Извлечение информации поиска об артистах
 * @returns {Object} Результат поиска артистов
 */
async function fetch_artists_result(){
    /*Ссылки на изображения приходящие по запросу по какой то причине указывают на серое изображение */
    const artists_amount = 7;
    const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${search_text}&api_key=${search_api_key}&limit=${artists_amount}&format=json`)
    .catch(() => {
        alert("Failed to establish a connection with the server");
    });
    const data = await response.json().catch(() => {
        alert("Failed to parse data from server");
    });
    return data;
}
/**
 * Извлечение информации поиска об альбомах
 * @returns {Object} Результат поиска альбомов
 */
async function fetch_albums_result(){
    const albums_amount = 7;
    const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=album.search&album=${search_text}&api_key=${search_api_key}&limit=${albums_amount}&format=json`)
    .catch(() => {
        alert("Failed to establish a connection with the server");
    });
    const data = await response.json().catch(() => {
        alert("Failed to parse data from server");
    });
    return data;
}
/**
 * Извлечение информации поиска о треках
 * @returns {Object} Результат поиска треков
 */
async function fetch_tracks_result(){
    /*Ссылки на изображения приходящие по запросу по какой то причине указывают на серое изображение */
    const tracks_amount = 7;
    const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${search_text}&api_key=${search_api_key}&limit=${tracks_amount}&format=json`)
    .catch(() => {
        alert("Failed to establish a connection with the server");
    });
    const data = await response.json().catch(() => {
        alert("Failed to parse data from server");
    });
    return data;
}
/**
 * Вставка шаблона в список артистов найденных по запросу
 * @param {Object} list 
 * @param {string} artist_name 
 * @param {string} listeners_amount 
 * @param {string} artist_url 
 * @param {string} img_url 
 */
function insert_data_artist(list, artist_name, listeners_amount, artist_url, img_url = "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.jpg"){
    list.insertAdjacentHTML("beforeend", create_image_artist_card(
                                    artist_name,
                                    listeners_amount,
                                    artist_url,
                                    img_url
                                    ))
}
/**
 * Вставка шаблона в список альбомов найденных по запросу
 * @param {Object} list 
 * @param {string} album_name 
 * @param {string} album_url 
 * @param {string} artist_name 
 * @param {string} artist_url 
 * @param {string} img_url 
 */
function insert_data_album(list, album_name, album_url, artist_name, artist_url, img_url = "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.jpg"){
    list.insertAdjacentHTML("beforeend", create_image_album_card(
                                            album_name,
                                            album_url,
                                            artist_name,
                                            artist_url,
                                            img_url
                                        ))
}
/**
 * Вставка шаблона в список треков найденных по запросу
 * @param {Object} list 
 * @param {string} track_name 
 * @param {string} track_url 
 * @param {string} author_name 
 * @param {string} author_url 
 * @param {string} img_url 
 */
function insert_data_tracks(list, track_name, track_url, author_name, author_url, img_url = "https://lastfm.freetls.fastly.net/i/u/64s/4128a6eb29f94943c9d206c08e625904.jpg"){
    list.insertAdjacentHTML("beforeend", create_line_music_card(
                                            track_name,
                                            track_url,
                                            author_name,
                                            author_url,
                                            img_url
                                        ))
}
/**
 * Очистить поле вывода результатов поиска
 */
function clear_search_result_area(){
    search_result_area.querySelectorAll(".search-content-section").forEach((el) => {
        el.parentNode.removeChild(el);
    })
}
