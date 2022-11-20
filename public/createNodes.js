/**
 * Добавляем большую карточку в список популярных артистов
 * @param {string} name Имя автора
 * @param {string} name_url ссылка на автора  
 * @param {string} img_url ссылка на картинку автора
 * @param {Object[]} genres Топ жанры данного автора
 */
 function append_big_card(name, name_url, img_url, genres){
    let card = document.createElement("div");
    card.classList.add("big-card");

    let link_with_img = document.createElement("a");
    link_with_img.href = name_url;

    let card_image = document.createElement("img");
    card_image.src = img_url;
    card_image.className = "big-card__image";

    link_with_img.appendChild(card_image);

    card.appendChild(link_with_img);

    let link_with_name = create_link(name, name_url, "text-black", "big-card__author");

    card.appendChild(link_with_name);

    let genres_list = document.createElement("ul");
    genres_list.className = "card-genre";

    genres.forEach(element => {
        genres_list.appendChild(create_genre_list_child(element.name, element.url));
    });

    card.appendChild(genres_list);

    hotList.append(card)
}


/**
 * Добавляем малую карточку в список популярных треков
 * @param {string} track_name Название трека
 * @param {string} track_url Ссылка на трек
 * @param {string} artist_name Имя автора
 * @param {string} artist_url Ссылка на автора
 * @param {string} img_url Ссылка на картинку трека
 * @param {Object[]} genres Топ жанры данного трека
 */
 function append_small_card(track_name, track_url, artist_name, artist_url, img_url, genres){
    let card = document.createElement("div");
    card.classList.add("small-card");

    let link_with_img = document.createElement("a");
    link_with_img.href = track_url;

    let card_image = document.createElement("img");
    card_image.src = img_url;
    card_image.className = "small-card__image";

    link_with_img.appendChild(card_image);

    card.appendChild(link_with_img);

    let info = document.createElement("div")
    info.className = "small-card__info"

    let link_with_track_name = create_link(track_name, track_url, "text-black", "small-card__song-name");

    let link_with_artist_name = create_link(artist_name, artist_url, "text-black", "small-card__author");

    info.appendChild(link_with_track_name);
    info.appendChild(link_with_artist_name);

    let genres_list = document.createElement("ul");
    genres_list.className = "card-genre";

    genres.slice(0, 3).forEach(element => {
        genres_list.appendChild(create_genre_list_child(element.name, element.url));
    });

    info.appendChild(genres_list);

    card.appendChild(info);

    popularTracksList.append(card)
}



/**
 * Создаем ссылку с текстом
 * @param {string} text Текст ссылки
 * @param {string} url Ссылка для ссылки
 * @param  {...string} classes CSS стили данной ссылки
 * @returns Ссылку
 */
function create_link(text, url, ...classes){
    let link = document.createElement("a");
    link.href = url;
    link.textContent = text;
    link.classList.add(...classes);
    
    return link;
}


/**
 * Создаем элемент списка жанров
 * @param {string} text Текст элемента
 * @param {string} url Ссылка элемента
 * @returns Элемент
 */
function create_genre_list_child(text, url){
    let list_child = document.createElement("li");
    list_child.classList.add("text-black", "card-genre-item");
    let list_child_link = document.createElement("a");
    list_child_link.classList.add("text-black", "card-genre-item-link");
    list_child_link.href = url;
    list_child_link.textContent = text;
    list_child.appendChild(list_child_link);
    return list_child;
}


/**
 * Создаем секцию для поля вывода поиска с названием категории
 * @param {string} title_text Название категории
 * @returns Секцию
 */
function create_search_content_section(title_text){
    let section = document.createElement("section");
    section.classList.add("search-content-section");

    let title = document.createElement("h2");
    title.classList.add("text-black", "search-content-section__header");
    title.textContent = title_text;
    section.appendChild(title);

    let list = document.createElement("div");
    if(title_text === "Artists"){
        list.classList.add("content-section__items", "artists-list");
    }
    if(title_text === "Albums"){
        list.classList.add("content-section__items", "albums-list");
    }
    if(title_text === "Tracks"){
        list.classList.add("tracks-list");
    }
    section.appendChild(list);

    return section;
}
/**
 * Создаем шаблон карточки артиста для вывода в поле результата поиска
 * @param {string} artist_name Имя артиста
 * @param {string} listeners_amount Количество слушателей
 * @param {string} artist_url Ссылка на артиста
 * @param {string} img_url Ссылка на кртинку артиста
 * @returns {string} Шаблон
 */
function create_image_artist_card(artist_name, listeners_amount, artist_url, img_url){
    if(img_url === "") {img_url = "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.jpg"}
    let template = `<div class="image-card">
    <img class="image-card-img" src=${img_url}>
    <div class="card-details">
      <a href=${artist_url} class="text-light image-card-info-name">${artist_name}</a>
      <p class="text-light image-card-info-listeners">${listeners_amount} listeners</p>
    </div>
  </div>`
    return template
}
/**
 * Создаем шаблон карточки альбома для вывода в поле результата поиска
 * @param {string} album_name Название альбома
 * @param {string} album_url Ссылка на альбом
 * @param {string} artist_name Имя артиста
 * @param {string} artist_url Ссылка на артиста
 * @param {string} img_url Ссылка на кртинку альбома
 * @returns {string} Шаблон
 */
function create_image_album_card(album_name, album_url, artist_name, artist_url, img_url){
    if(img_url === "") {img_url = "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.jpg"}
    let template = `<div class="image-card">
    <img class="image-card-img" src=${img_url}>
    <div class="card-details">
      <a href=${album_url} class="text-light image-card-info-name">${album_name}</a>
      <a href=${artist_url} class="text-light image-card-info-artist">${artist_name}</a>
    </div>
  </div>`
    return template
}
/**
 * Создаем шаблон карточки трека для вывода в поле результата поиска
 * @param {string} track_name Название трека
 * @param {string} track_url Ссылка на трек
 * @param {string} author_name Имя автора
 * @param {string} author_url Ссылка на автора
 * @param {string} img_url Ссылка на картинку
 * @returns {string} Шаблон
 */
function create_line_music_card(track_name, track_url, author_name, author_url, img_url){
    if(img_url === "") {img_url = "https://lastfm.freetls.fastly.net/i/u/64s/4128a6eb29f94943c9d206c08e625904.jpg"}
    let template = `<div class="line-music-card flex-block">
    <button class="line-music-card__button"> <img class="line-music-card__button-img" src="https://www.last.fm/static/images/icons/play_dark_16.e469e7d1482a.png"> </button>
    <a href=${track_url}><img class="line-music-card__img" src=${img_url} alt=""></a>
    <button class="line-music-card__button"> <img class="line-music-card__button-img" src="/img/heart.png"> </button>
    <div class="line-music-card__track-name"><a href=${track_url} class="text-black line-music-card__track-name-link">${track_name}</a></div>
    <div class="line-music-card__track-author"><a href=${author_url} class="text-black line-music-card__track-author-link">${author_name}</a></div>
    <div class="line-music-card-track-time"><p class="text-black line-music-card-track-time-text"></p></div>
  </div>`
    return template;
}
/**
 * Создаем шаблон поисковой строки в шапке
 * @returns {string} Шаблон
 */
function create_header_search_field(){
    const template = `<section class="header-search-field hidden">
    <input type="text" class="text-black header-search-input" placeholder="Input search">
    <button type="button" class="search-button header-cross"> <img class="search-button-img" src="https://www.last.fm/static/images/icons/clear_field_16.4768b21c62e1.png"> </button>
    <button type="button" class="search-button header-search-lens"> <img class="search-button-img" src="https://www.last.fm/static/images/icons/search_16.bde37072495a.png"> </button>
  </section>`;
  return template;
}