const search_categories_list = document.querySelector(".search-categories") //Список категорий поиска
const artists_list = document.querySelector(".artists-list"); //Список секции найденных артистов
const albums_list = document.querySelector(".albums-list"); //Список секции найденных альбомов
const tracks_list = document.querySelector(".tracks-list"); //Список секции найденных треков
const search_input = document.querySelector(".search-input"); //Строка ввода поискового запроса
const search_input_button = document.querySelector(".search-lens"); //Кнопка ввода поискового запроса(лупа)
const search_input_cross = document.querySelector(".cross") //Кнопка очистки поискового запроса(крестик)
const search_result_area = document.querySelector(".search-left-column") //Левая колонка для отображения информации о поиске
const search_result_header = document.querySelector(".search-header") //Заголовок для поля отображения поискового результата

/**
 * Входная функция для сбора всей необходимой информации и ее отображения
 * @param {string} category Категория поиска 
 */
async function start(category = "Top results"){
    const search_text = (new URLSearchParams(location.search)).get("search_text") ?? "";
    if(search_text != ""){
        const fetched_data = await fetch_all_data(search_text);
        show_search_result(search_text, category, fetched_data);
        if(fetched_data.data_artists.results.artistmatches.artist.length === 0
            && fetched_data.data_albums.results.albummatches.album.length === 0
            && fetched_data.data_tracks.results.trackmatches.track.length === 0
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
        const search_text = search_input.value;
        window.location.href = `search_page.html?search_text=${search_text}`;
    }
});
/**
 * Отслеживание нажатия на лупу при поиске
 */
search_input_button.addEventListener("click", () => {
        const search_text = search_input.value;
        window.location.href = `search_page.html?search_text=${search_text}`;
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
            const prevActiveTab = document.querySelector(".active-category");
            change_category(prevActiveTab);
            change_category(event.target);
            const categorie_type = event.target.textContent;
            start(categorie_type); 
        }
    }
});

/**
 * Смена класса активности у категории в списке категорий поиска
 * @param {object} tab Объект категории
 */
function change_category(tab){
    tab.classList.toggle("non-active-category");
    tab.classList.toggle("active-category");
}
/**
 * Функция отображения секции результата поиска в зависимоси от выбранной категории
 * @param {string} search_text Текст поиска
 * @param {string} categorie_type Категория поиска 
 * @param {object} fetchedData Результат поиска
 */
function show_search_result(search_text, categorie_type, fetchedData){
    clear_search_result_area();
    switch(categorie_type)
    {
        case "Top results":
            show_top_result(search_text, fetchedData);
            break;
        case "Artists":
            show_artists_result(fetchedData);
            break;
        case "Albums":
            show_albums_result(fetchedData);
            break;
        case "Tracks":
            show_tracks_result(fetchedData);
            break;
    }
}
/**
 * Отображение всех категорий
 * @param {string} search_text Текст поиска
 * @param {object} fetchedData Результат поиска
 */
function show_top_result(search_text, fetchedData){
    search_result_header.textContent = `Search results for "${search_text}"`;
    search_input.value = search_text;
    show_artists_result(fetchedData);
    show_albums_result(fetchedData);
    show_tracks_result(fetchedData);
}
/**
 * Отображение результатов по категории артистов
 * @param {object} fetchedData Результат поиска
 */
async function show_artists_result(fetchedData){
    search_result_area.appendChild(create_search_content_section("Artists"));
    const list = document.querySelector(".artists-list");
    fetchedData.data_artists.results.artistmatches.artist.forEach(el => {
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
 * @param {object} fetchedData Результат поиска
 */
async function show_albums_result(fetchedData){
    search_result_area.appendChild(create_search_content_section("Albums"));
    const list = document.querySelector(".albums-list");
    fetchedData.data_albums.results.albummatches.album.forEach(el => {
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
 * @param {object} fetchedData Результат поиска
 */
async function show_tracks_result(fetchedData){
    search_result_area.appendChild(create_search_content_section("Tracks"));
    const list = document.querySelector(".tracks-list");
    fetchedData.data_tracks.results.trackmatches.track.forEach(el => {
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
 * @param {string} search_text Текст поиска
 */
async function fetch_all_data(search_text){
    const result_data = {
        data_artists : undefined,
        data_albums : undefined,
        data_tracks : undefined
    }
    await Promise.all([fetch_result("artist.search", "artist", search_text, 8), fetch_result("album.search", "album", search_text, 8), fetch_result("track.search", "track", search_text, 8)]).then(
        ([data1, data2, data3]) => {
            result_data.data_artists = data1;
            result_data.data_albums = data2;
            result_data.data_tracks = data3;
        }
    )
    return result_data;
}
/**
 * Извлечение данных
 * @param {string} method Метод извлечения данных
 * @param {string} category Категория поиска
 * @param {string} search_text Текст поиска
 * @param {number} amount Предельное количество объектов
 * @param {string} api_key Апи ключ
 * @returns 
 */
async function fetch_result(method, category, search_text, amount = 7, api_key = "687f75d4e98de92fbb1997c826992306"){
    const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=${method}&${category}=${search_text}&api_key=${api_key}&limit=${amount}&format=json`)
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
